/**
 * Tiny dependency boundary between MCP dispatch and the browser bridge.
 *
 * Importing the full bridge from the MCP kernel pulls the command broker, recorder and agent
 * graph back into the tool-registration graph. Apart from making that dependency direction
 * misleading, Rollup cannot safely order the resulting main-process cycle. The bridge installs
 * the one process-local sender it owns; callers know only that an exact scan was requested.
 */

type CorrelationScanSender = (requestId: string) => boolean;

let correlationScanSender: CorrelationScanSender | null = null;

export function setBrowserCorrelationScanSender(sender: CorrelationScanSender | null): void {
  correlationScanSender = sender;
}

export function requestBrowserCorrelationScan(requestId: string | null | undefined): boolean {
  if (typeof requestId !== 'string' || requestId.length < 1 || requestId.length > 300) return false;
  return correlationScanSender?.(requestId) === true;
}
