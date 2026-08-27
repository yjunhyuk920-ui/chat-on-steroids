/**
 * Durable, event-driven execution for the model-visible `agents` tool.
 *
 * ChatGPT may expose `message.metadata.request_id` only after the MCP response has already
 * timed out. Waiting for a larger fixed number merely moves that failure. This module accepts
 * the validated semantic action without executing it, then listens for the exact
 * request-id→conversation proof and commits the action once. The broker snapshot stores both
 * the pending intent and its terminal receipt, so a restart cannot replay an already-accepted
 * spawn/message/finish.
 */

import {
  AgentError,
  PRIME_ID,
  agentForCaller,
  deferredAgentAction,
  deferredAgentActionsForRequest,
  noteAgentContextTokens,
  noteDeferredAgentActionOutcomeOffered,
  pendingDeferredAgentActions,
  persistCriticalSwarmNow,
  requestWorkerBootstraps,
  requestWorkerRevivals,
  stageDeferredAgentAction,
  stageDeferredAgentActionOutcome,
  stageFinishAgent,
  stageMessages,
  stageSpawn,
  statusForCaller,
  swarmStateForCaller,
  type Caller,
  type DeferredAgentActionInput,
  type DeferredAgentActionOutcome,
  type DeferredAgentActionRecord,
  type StagedDeferredAgentAction
} from '../agents.js';
import { requestBrowserCorrelationScan } from '../browser-control.js';
import { logInfo, logWarn } from '../logger.js';
import { repairPrimeFromResumeShadow } from '../session/continuation.js';
import {
  awaitRequestCorrelation,
  onRequestCorrelationObservation,
  requestCorrelation,
  requestCorrelationConflicted,
  type RequestCorrelation,
  type RequestCorrelationObservation
} from '../session/correlation.js';
import { recordAgentMessage } from '../session/recorder.js';
import { findSessionByConversation } from '../session/store.js';
import { currentCall, currentCaller } from './call-context.js';
import { adoptAgent, friendlyError, type ToolResult } from './kernel.js';

const scans = new Map<string, { timer: NodeJS.Timeout | null; delayMs: number }>();
const requestChains = new Map<string, Promise<void>>();
let unsubscribeCorrelation: (() => void) | null = null;
let engineStopping = false;

class DeferredActionDurabilityError extends Error {}
/** Small coalescing window for evidence already in flight; correctness continues durably after it. */
const IN_FLIGHT_EVIDENCE_COALESCE_MS = 250;

function asToolResult(outcome: DeferredAgentActionOutcome): ToolResult {
  return {
    content: [{ type: 'text', text: outcome.text }],
    ...(outcome.structuredContent ? { structuredContent: outcome.structuredContent } : {}),
    ...(outcome.isError ? { isError: true } : {})
  };
}

function pendingResult(record: DeferredAgentActionRecord): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text:
          'PENDING_IDENTITY: this validated agents action is stored but has not run. Chat On Steroids will execute it ' +
          'once, automatically, only when this exact ChatGPT request id is proven to belong to a conversation. Do not ' +
          'repeat the identical action. Its outcome and any worker reports will be attached to a later authenticated ' +
          'tool result. If exact evidence never arrives, the action expires without side effects.'
      }
    ],
    structuredContent: {
      action: record.input.action,
      pending_identity: true,
      deferred_action_id: record.id.slice(0, 16),
      expires_at: new Date(record.expiresAt).toISOString()
    }
  };
}

function normalizedOutcome(result: ToolResult): DeferredAgentActionOutcome {
  return {
    text: result.content.map((part) => (part.type === 'text' ? part.text : '')).filter(Boolean).join('\n'),
    ...(result.structuredContent ? { structuredContent: result.structuredContent } : {}),
    ...(result.isError ? { isError: true } : {})
  };
}

function failureOutcome(error: unknown): DeferredAgentActionOutcome {
  return { text: friendlyError(error), isError: true };
}

function actionInCurrentCall(record: DeferredAgentActionRecord, conversationId: string | null): boolean {
  const call = currentCall();
  return Boolean(
    call &&
      call.caller.requestId === record.requestId &&
      conversationId &&
      call.caller.conversationId === conversationId
  );
}

function markDirectReceipt(record: DeferredAgentActionRecord): void {
  noteDeferredAgentActionOutcomeOffered(record.id);
  const call = currentCall();
  if (call) call.deferredAgentActionId = record.id;
}

async function persistPending(stage: StagedDeferredAgentAction): Promise<void> {
  if (!stage.created) return;
  try {
    if (!(await persistCriticalSwarmNow())) {
      throw new Error('the broker has no immediate durable persistence sink');
    }
    stage.commitPending();
  } catch (error) {
    stage.rollback();
    throw new DeferredActionDurabilityError(
      `The agents action could not cross its durable acceptance barrier before identity resolution. Nothing was executed. (${friendlyError(error)})`
    );
  }
}

interface DomainStage {
  commit: () => void;
  rollback: () => void;
}

const NO_DOMAIN_STAGE: DomainStage = { commit: () => undefined, rollback: () => undefined };

async function commitOutcome(
  record: DeferredAgentActionRecord,
  conversationId: string | null,
  status: 'completed' | 'failed' | 'cancelled',
  outcome: DeferredAgentActionOutcome,
  domain: DomainStage = NO_DOMAIN_STAGE
): Promise<DeferredAgentActionRecord> {
  const receipt = stageDeferredAgentActionOutcome(
    record.id,
    conversationId,
    status,
    outcome,
    Date.now(),
    actionInCurrentCall(record, conversationId)
  );
  if (receipt.repeat) {
    domain.rollback();
    return receipt.record;
  }
  try {
    if (!(await persistCriticalSwarmNow())) {
      throw new Error('the broker has no immediate durable persistence sink');
    }
    domain.commit();
    receipt.commit();
    return receipt.record;
  } catch (error) {
    receipt.rollback();
    domain.rollback();
    throw new DeferredActionDurabilityError(
      `The deferred agents action could not cross its durable commit barrier. It remains pending and no result was published. (${friendlyError(error)})`
    );
  }
}

/** Re-measures sleeping worker authority from the app's own durable session store. */
async function measureSleepingWorkers(caller: Caller): Promise<void> {
  for (const info of swarmStateForCaller(caller).agents) {
    if (info.role !== 'worker' || info.state !== 'sleeping' || !info.conversationId) continue;
    const summary = await findSessionByConversation(info.conversationId, { requireUnique: true }).catch(() => null);
    if (summary) noteAgentContextTokens(info.conversationId, summary.contextTokens);
  }
  try {
    if (!(await persistCriticalSwarmNow())) {
      throw new Error('the broker has no immediate durable persistence sink');
    }
  } catch (error) {
    throw new DeferredActionDurabilityError(
      `Worker context/revival state could not cross its durable barrier. (${friendlyError(error)})`
    );
  }
}

function spawnResult(
  created: Array<{ id: string; label: string; state: string }>,
  becamePrime: boolean,
  runId: string
): ToolResult {
  const invited = created.filter((worker) => worker.state === 'invited');
  const sleeping = created.filter((worker) => worker.state === 'sleeping');
  return {
    content: [
      {
        type: 'text',
        text:
          (becamePrime ? `This conversation is now the prime agent of run ${runId}. ` : '') +
          `${created.length} worker(s) matched: ${created.map((info) => `${info.id} (${info.label}, ${info.state})`).join(', ')}. ` +
          (invited.length > 0 ? 'New worker chats are opening with their briefs already in them. ' : '') +
          (sleeping.length > 0
            ? `${sleeping.map((worker) => worker.id).join(', ')} already finished that earlier piece and is sleeping in its existing chat; wake it with action=message instead of spawning a duplicate. `
            : '') +
          'Carry on with your own work — results and messages arrive at the end of later tool results, so there is ' +
          'nothing to wait for and never anything to poll. A short correction with action=message while a worker is ' +
          'still going is far cheaper than the alternative.'
      }
    ],
    structuredContent: {
      action: 'spawn',
      run_id: runId,
      self: PRIME_ID,
      became_prime: becamePrime,
      workers: created.map((info) => ({ id: info.id, label: info.label, state: info.state }))
    }
  };
}

async function executeResolvedAction(record: DeferredAgentActionRecord, conversationId: string): Promise<ToolResult> {
  const input = record.input;
  const caller: Caller = { conversationId };
  await repairPrimeFromResumeShadow(conversationId);

  if (input.action === 'spawn') {
    const staged = stageSpawn({
      workers: input.workers,
      context: input.context,
      caller
    });
    const result = spawnResult(staged.created, staged.becamePrime, staged.runId);
    await commitOutcome(record, conversationId, 'completed', normalizedOutcome(result), staged);
    requestWorkerBootstraps(staged.created.map((worker) => worker.id));
    await adoptAgent(PRIME_ID);
    return result;
  }

  if (input.action === 'message') {
    await measureSleepingWorkers(caller);
    const staged = stageMessages(caller, input.messages);
    const sent = staged.messages;
    const woken = staged.waking;
    const result: ToolResult = {
      content: [
        {
          type: 'text',
          text:
            `Queued for ${sent.map((message) => message.to).join(', ')}. ` +
            (woken.length > 0
              ? `${woken.join(', ')} ${woken.length === 1 ? 'was' : 'were'} asleep and ${woken.length === 1 ? 'is' : 'are'} ` +
                'being woken in the same chat, with everything already known there still in it; your message is the next thing it reads. '
              : '') +
            'Carry on with the work — a reply, if there is one, arrives at the end of a later tool result.'
        }
      ],
      structuredContent: {
        action: 'message',
        queued: sent.map((message) => ({ id: message.id, to: message.to })),
        waking: woken
      }
    };
    await commitOutcome(record, conversationId, 'completed', normalizedOutcome(result), staged);
    if (woken.length > 0) requestWorkerRevivals(woken);
    for (const message of sent) {
      try {
        await recordAgentMessage(message, 'sent');
      } catch (error) {
        logWarn(`could not record a committed delayed agent message: ${friendlyError(error)}`);
      }
    }
    return result;
  }

  if (input.action === 'finish') {
    const staged = stageFinishAgent(caller, input.result);
    const { info, report, repeat } = staged;
    const result: ToolResult = {
      content: [
        {
          type: 'text',
          text: repeat
            ? `${info.id} was already ${info.state} and the prime agent already has that result, so nothing was sent again. Stop working and stop calling tools.`
            : info.state === 'finished'
              ? `${info.id} is finished. The prime agent has your result. This chat has also reached its context limit, so there will be no more work in it: stop working and stop calling tools.`
              : `${info.id} reported and is now asleep. The prime agent has your result and your worker slot is free. Stop working and stop calling tools; if the prime has more for you it will say so here in this same chat, and you pick up from what you already know.`
        }
      ],
      structuredContent: { action: 'finish', self: info.id, state: info.state, repeat }
    };
    await commitOutcome(record, conversationId, 'completed', normalizedOutcome(result), staged);
    if (report) {
      try {
        await recordAgentMessage(report, 'sent');
      } catch (error) {
        logWarn(`could not record a committed delayed worker report: ${friendlyError(error)}`);
      }
    }
    return result;
  }

  await measureSleepingWorkers(caller);
  const status = statusForCaller(caller);
  const me = status.self;
  const state = status.state;
  const failed = state.agents.filter((info) => info.state === 'failed');
  const shown = (info: { state: string; revivable: boolean }): string =>
    info.state === 'sleeping'
      ? info.revivable
        ? 'sleeping (reported; waiting for new instructions)'
        : 'sleeping'
      : info.state === 'waking'
        ? 'waking (your message is being delivered to its chat)'
        : info.state;
  const asleep = state.agents.filter((info) => info.state === 'sleeping' && info.revivable);
  const slots = status.freeWorkerSlots;
  const result: ToolResult = {
    content: [
      {
        type: 'text',
        text:
          `You are ${me.id}.\n` +
          state.agents
            .map(
              (info) =>
                `${info.id}  ${info.role}  ${shown(info)}  waiting ${info.pending}  ${info.label}` +
                (info.result
                  ? `\n    ${info.state === 'failed' ? 'failure' : info.state === 'finished' ? 'result' : 'latest result'}: ${info.result.slice(0, 300)}`
                  : '')
            )
            .join('\n') +
          (me.id === PRIME_ID
            ? `\n\n${slots} of your worker slots ${slots === 1 ? 'is' : 'are'} free.` +
              (asleep.length > 0
                ? ` ${asleep.map((info) => info.id).join(', ')} ${asleep.length === 1 ? 'is' : 'are'} asleep and can be woken with agents action=message, in the chat they already have and with everything they learned there still in it. Prefer that to action=spawn${slots === 0 ? ', once a slot frees up.' : '.'}`
                : '')
            : '') +
          (failed.length > 0
            ? `\n\n${failed.map((info) => info.id).join(', ')} will not report. Do that work yourself or wake another worker; do not wait for them.`
            : '')
      }
    ],
    structuredContent: {
      action: 'status',
      run_id: status.runId,
      self: me.id,
      free_worker_slots: slots,
      agents: state.agents.map((info) => ({
        id: info.id,
        role: info.role,
        label: info.label,
        state: info.state,
        revivable: info.revivable,
        waiting: info.pending,
        result: info.result ?? null
      }))
    }
  };
  await commitOutcome(record, conversationId, 'completed', normalizedOutcome(result));
  return result;
}

async function settleWithoutEffect(
  record: DeferredAgentActionRecord,
  status: 'failed' | 'cancelled',
  outcome: DeferredAgentActionOutcome,
  conversationId: string | null
): Promise<void> {
  await commitOutcome(record, conversationId, status, outcome);
}

async function resolveOne(record: DeferredAgentActionRecord, correlation: RequestCorrelation): Promise<void> {
  const current = deferredAgentAction(record.requestId, record.input);
  if (!current || current.status !== 'pending') return;
  if (Date.now() >= current.expiresAt) {
    await settleWithoutEffect(
      current,
      'cancelled',
      {
        text: 'AGENT_ACTION_EXPIRED: exact conversation evidence did not arrive before this deferred action expired. Nothing was executed.',
        isError: true
      },
      correlation.conversationId
    );
    return;
  }
  try {
    await executeResolvedAction(current, correlation.conversationId);
    logInfo(`multi-agent: committed deferred ${current.input.action} ${current.id.slice(0, 12)} after exact request attribution`);
  } catch (error) {
    if (error instanceof DeferredActionDurabilityError) throw error;
    try {
      await settleWithoutEffect(current, 'failed', failureOutcome(error), correlation.conversationId);
    } catch (settleError) {
      if (settleError instanceof DeferredActionDurabilityError) throw settleError;
      throw error;
    }
    logInfo(`multi-agent: deferred ${current.input.action} ${current.id.slice(0, 12)} was safely rejected after attribution`);
  }
}

async function cancelRequest(requestId: string, reason: string): Promise<void> {
  for (const record of deferredAgentActionsForRequest(requestId)) {
    if (record.status !== 'pending') continue;
    try {
      await settleWithoutEffect(record, 'cancelled', { text: reason, isError: true }, null);
    } catch (error) {
      logWarn(`could not durably cancel deferred agents action ${record.id.slice(0, 12)}: ${friendlyError(error)}`);
    }
  }
}

async function resolveRequestNow(
  requestId: string,
  observation: RequestCorrelationObservation,
  supplied: RequestCorrelation | null
): Promise<void> {
  stopScan(requestId);
  if (observation === 'conflict' || requestCorrelationConflicted(requestId)) {
    await cancelRequest(
      requestId,
      'AGENT_ACTION_CANCELLED: contradictory page evidence claimed this request id for more than one conversation. Nothing was executed.'
    );
    return;
  }
  const correlation = supplied ?? requestCorrelation(requestId);
  if (!correlation) {
    armScan(requestId);
    return;
  }
  const actions = deferredAgentActionsForRequest(requestId)
    .filter((record) => record.status === 'pending')
    // Array.sort is stable. Equal millisecond timestamps therefore retain the broker Map's
    // insertion order — essential when one ChatGPT workflow issues spawn followed by status.
    .sort((left, right) => left.createdAt - right.createdAt);
  for (const record of actions) {
    try {
      await resolveOne(record, correlation);
    } catch (error) {
      // A durable sink failure is retryable and leaves the exact action pending with no
      // published side effect. Serialize a later retry behind this request rather than
      // allowing a status/message sibling to overtake the action that should precede it.
      logWarn(`deferred agents action ${record.id.slice(0, 12)} remains pending: ${friendlyError(error)}`);
      scheduleResolvedRetry(requestId);
      break;
    }
  }
}

function queueRequestResolution(
  requestId: string,
  observation: RequestCorrelationObservation,
  correlation: RequestCorrelation | null
): Promise<void> {
  if (engineStopping) return Promise.resolve();
  const prior = requestChains.get(requestId) ?? Promise.resolve();
  const next = prior
    .catch(() => undefined)
    .then(() => resolveRequestNow(requestId, observation, correlation))
    .finally(() => {
      if (requestChains.get(requestId) === next) requestChains.delete(requestId);
    });
  requestChains.set(requestId, next);
  return next;
}

function scheduleResolvedRetry(requestId: string): void {
  if (engineStopping || scans.has(requestId)) return;
  const state = { timer: null as NodeJS.Timeout | null, delayMs: 2_000 };
  state.timer = setTimeout(() => {
    scans.delete(requestId);
    const correlation = requestCorrelation(requestId);
    if (correlation) void queueRequestResolution(requestId, 'resolved', correlation);
  }, state.delayMs);
  state.timer.unref?.();
  scans.set(requestId, state);
}

function stopScan(requestId: string): void {
  const state = scans.get(requestId);
  if (!state) return;
  if (state.timer) clearTimeout(state.timer);
  scans.delete(requestId);
}

/** Electron-owned scan pump; hidden page timers are not part of the correctness path. */
function armScan(requestId: string): void {
  if (engineStopping) return;
  if (scans.has(requestId)) return;
  const state = { timer: null as NodeJS.Timeout | null, delayMs: 250 };
  const scan = (): void => {
    const pending = deferredAgentActionsForRequest(requestId).filter((record) => record.status === 'pending');
    if (pending.length === 0) {
      stopScan(requestId);
      return;
    }
    if (requestCorrelationConflicted(requestId)) {
      void queueRequestResolution(requestId, 'conflict', null);
      return;
    }
    const correlation = requestCorrelation(requestId);
    if (correlation) {
      void queueRequestResolution(requestId, 'resolved', correlation);
      return;
    }
    const now = Date.now();
    const live = pending.filter((record) => record.expiresAt > now);
    if (live.length === 0) {
      void cancelRequest(
        requestId,
        'AGENT_ACTION_EXPIRED: exact conversation evidence did not arrive before this deferred action expired. Nothing was executed.'
      ).finally(() => stopScan(requestId));
      return;
    }
    requestBrowserCorrelationScan(requestId);
    state.timer = setTimeout(scan, state.delayMs);
    state.timer.unref?.();
    state.delayMs = Math.min(state.delayMs * 2, 10_000);
  };
  scans.set(requestId, state);
  scan();
}

function ensureEngine(): void {
  if (unsubscribeCorrelation || engineStopping) return;
  unsubscribeCorrelation = onRequestCorrelationObservation((requestId, observation, correlation) => {
    if (deferredAgentActionsForRequest(requestId).some((record) => record.status === 'pending')) {
      void queueRequestResolution(requestId, observation, correlation);
    }
  });
}

/** Startup hook: restores pending scans or immediately commits already-proven requests. */
export function startDeferredAgentActionEngine(): void {
  engineStopping = false;
  ensureEngine();
  for (const record of pendingDeferredAgentActions()) {
    if (requestCorrelationConflicted(record.requestId)) {
      void queueRequestResolution(record.requestId, 'conflict', null);
      continue;
    }
    const correlation = requestCorrelation(record.requestId);
    if (correlation) void queueRequestResolution(record.requestId, 'resolved', correlation);
    else armScan(record.requestId);
  }
}

/** Stops process-lifetime timers/listeners; pending work itself remains durable for restart. */
export async function stopDeferredAgentActionEngine(): Promise<void> {
  engineStopping = true;
  unsubscribeCorrelation?.();
  unsubscribeCorrelation = null;
  for (const requestId of [...scans.keys()]) stopScan(requestId);
  const draining = [...requestChains.values()];
  if (draining.length > 0) await Promise.allSettled(draining);
  requestChains.clear();
}

/**
 * Handles one already-schema-validated agents action.
 *
 * Every request-id-bearing call receives a durable semantic receipt, even when identity was
 * already available. That is what makes an identical ChatGPT retry idempotent on both the fast
 * path and the delayed path. Calls with no request id retain the old fail-closed behaviour.
 */
export async function handleAgentAction(input: DeferredAgentActionInput): Promise<ToolResult> {
  ensureEngine();
  const base = currentCaller();
  if (!base.requestId) {
    throw new AgentError(
      'WORKER_IDENTITY_LOST: this agents request carried no exact ChatGPT request id, so it could not be attributed or deferred. Nothing was executed. Check that the browser extension is connected in this tab.'
    );
  }

  const staged = stageDeferredAgentAction(base.requestId, input);
  const prior = staged.record;
  if (prior.status !== 'pending' && prior.outcome) {
    markDirectReceipt(prior);
    return asToolResult(prior.outcome);
  }
  await persistPending(staged);

  if (requestCorrelationConflicted(base.requestId)) {
    await queueRequestResolution(base.requestId, 'conflict', null);
  } else {
    const correlation = base.conversationId
      ? {
          requestId: base.requestId,
          conversationId: base.conversationId,
          sessionId: 'current-call',
          messageId: 'current-call',
          tool: 'agents',
          observedAt: Date.now()
        }
      : requestCorrelation(base.requestId);
    if (correlation) {
      await queueRequestResolution(base.requestId, 'resolved', correlation);
    } else {
      // The extension often posts evidence in the same event-loop turn as this HTTP call. Give
      // that already-moving event one tiny coalescing window so the common path still returns
      // the real result. This is not the correctness deadline: after it, the durable action and
      // Electron scan pump continue without holding the MCP request open.
      const inFlight = await awaitRequestCorrelation(base.requestId, IN_FLIGHT_EVIDENCE_COALESCE_MS);
      if (inFlight) await queueRequestResolution(base.requestId, 'resolved', inFlight);
      else armScan(base.requestId);
    }
  }

  const after = deferredAgentAction(base.requestId, input);
  if (after && after.status !== 'pending' && after.outcome) {
    markDirectReceipt(after);
    if (after.conversationId) {
      const call = currentCall();
      if (call) call.caller.conversationId = after.conversationId;
      await adoptAgent(agentForCaller({ conversationId: after.conversationId }));
    }
    return asToolResult(after.outcome);
  }
  if (!after) throw new DeferredActionDurabilityError('The deferred agents action disappeared before acceptance.');
  return pendingResult(after);
}
