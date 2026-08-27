/** Korean UI layer for the popup and ChatGPT controls owned by this extension. */
(() => {
  'use strict';

  const KO = new Map([
    ['Looking for the app', '앱을 찾는 중'],
    ['Session capture', '세션 수집'],
    ['ChatGPT tab', 'ChatGPT 탭'],
    ['Recording this chat', '이 채팅 기록 중'],
    ['Chat ID', '채팅 ID'],
    ['Request ID', '요청 ID'],
    ['Reaching the app', '앱으로 전송'],
    ['Picked up', '수집됨'],
    ['Sent to app', '앱에 전송됨'],
    ['App processed', '앱 처리 완료'],
    ['Augment ChatGPT', 'ChatGPT 확장 기능'],
    ['Overwrite ChatGPT', 'ChatGPT 표시 개선'],
    ['Timestamps', '타임스탬프'],
    ['Advanced', '고급'],
    ['Copy', '복사'],
    ['Try again', '다시 시도'],
    ['Disconnect', '연결 해제'],
    ['Connect', '연결'],
    ['Version mismatch', '버전 불일치'],
    ['Disconnected', '연결 해제됨'],
    ['App not running', '앱이 실행 중이 아님'],
    ['none open', '열린 탭 없음'],
    ['answering', '응답 중'],
    ['reload', '새로고침 필요'],
    ['new chat', '새 채팅'],
    ['none yet', '아직 없음'],
    ['blocked', '차단됨'],
    ['live', '실시간'],
    ['waiting', '대기 중'],
    ['copied', '복사됨'],
    ['copy failed', '복사 실패'],
    ['Starting…', '시작 중…'],
    ['Stopping…', '중지 중…'],
    ['Settling…', '응답 완료 대기 중…'],
    ['Asking…', '요청 중…'],
    ['Writing…', '작성 중…'],
    ['Saving…', '저장 중…'],
    ['Opening…', '여는 중…'],
    ['Waiting…', '대기 중…'],
    ['Opened', '열림'],
    ['Compact', '압축'],
    ['Failed', '실패'],
    ['Cancel Compact & resume', '압축 및 이어하기 취소'],
    ['Chat On Steroids settings', 'Chat On Steroids 설정'],
    ['Auto-compaction', '자동 압축'],
    ['Goal', '목표'],
    ['Goal on', '목표 켜짐'],
    ['Goal off', '목표 꺼짐'],
    ['Goal on — no API key', '목표 켜짐 — API 키 없음'],
    ['Goal off — the prime writes this chat', '목표 꺼짐 — 주 에이전트가 이 채팅을 작성함'],
    ['compact this chat by hand', '이 채팅을 직접 압축'],
    ['threshold set in the app', '앱에서 임계값 설정됨'],
    ['OpenRouter API key essential for goal feature', '목표 기능에는 OpenRouter API 키가 필요함'],
    ['reply as you until the goal is met', '목표를 달성할 때까지 사용자를 대신해 응답'],
    ['change the goal', '목표 변경'],
    ['add specific goal', '구체적인 목표 추가'],
    ['What does this chat have to reach?', '이 채팅이 달성해야 할 목표는 무엇인가요?'],
    ['working…', '처리 중…'],
    ['Save', '저장'],
    ['Cancel', '취소'],
    ['Clear', '지우기'],
    ['Compact & resume unavailable', '압축 및 이어하기 사용 불가'],
    ['Cancel compaction', '압축 취소'],
    ['Compact & resume now', '지금 압축하고 이어하기'],
    ['The instruction this app gave the worker — not something you typed', '앱이 작업자에게 전달한 지침 — 사용자가 입력한 내용이 아님'],
    ['The handoff brief this app carried over — not something you typed', '앱이 이어온 인계 요약 — 사용자가 입력한 내용이 아님'],
    ['Opening a fresh chat', '새 채팅 여는 중'],
    ['Waiting for Chrome', 'Chrome 대기 중'],
    ['ChatGPT is writing the handoff', 'ChatGPT가 인계 내용을 작성 중'],
    ['Answer settling', '응답 완료 대기'],
    ['Reading the chat', '채팅 읽기'],
    ['Writing the reply', '답변 작성'],
    ['Sending', '전송'],
    ['The goal loop stopped', '목표 실행이 중지됨'],
    ['Sending it to ChatGPT', 'ChatGPT로 전송 중'],
    ['Goal reached', '목표 달성'],
    ['nothing was sent', '전송된 내용 없음'],
    ['Checking the answer is finished', '답변 완료 여부 확인 중'],
    ['Sending the answer to OpenRouter', 'OpenRouter로 답변 전송 중'],
    ['Dismiss', '닫기'],
    ['Dismiss Goal status', '목표 상태 닫기'],
    ['The brief is finished; waiting for the app to store it.', '요약이 완료되어 앱 저장을 기다리는 중입니다.'],
    ['Handoff saved, opening the fresh chat', '인계를 저장했고 새 채팅을 여는 중입니다.'],
    ['The app is trying to open the fresh chat.', '앱이 새 채팅을 열려고 시도 중입니다.'],
    ['The fresh chat is open', '새 채팅이 열렸습니다.'],
    ['Resume cancelled', '이어하기가 취소되었습니다.'],
    ['Compaction failed', '압축에 실패했습니다.'],
    ['Browser connection is disconnected in Chat On Steroids.', 'Chat On Steroids에서 브라우저 연결이 해제되었습니다.'],
    ['Chat On Steroids is not running on this PC.', '이 PC에서 Chat On Steroids가 실행 중이 아닙니다.'],
    ['Nothing to compact yet — send a message, or set a goal and it writes one.', '아직 압축할 내용이 없습니다. 메시지를 보내거나 목표를 설정하세요.'],
    ['Recording into the app.', '앱에 기록 중입니다.'],
    ['Waiting for the first message.', '첫 메시지를 기다리는 중입니다.'],
    ['The app is not reachable. Nothing is leaving this browser.', '앱에 연결할 수 없어 브라우저 밖으로 전송되지 않습니다.'],
    ['Queued here. Retrying delivery to the app.', '대기열에 보관 중이며 앱 전송을 다시 시도합니다.'],
    ['Delivered. The app has not opened a session for this chat yet.', '전송되었습니다. 앱이 아직 이 채팅의 세션을 열지 않았습니다.'],
    ['Every tool call matched end to end.', '모든 도구 호출이 처음부터 끝까지 일치합니다.']
  ]);

  const PATTERNS = [
    [/^Connected · Port (\d+)$/, (port) => `연결됨 · 포트 ${port}`],
    [/^Port (\d+) · connecting$/, (port) => `포트 ${port} · 연결 중`],
    [/^Auto-compaction on, from (.+) tokens$/, (count) => `자동 압축 켜짐, ${count}토큰부터`],
    [/^from (.+) tokens$/, (count) => `${count}토큰부터`],
    [/^(.+) is writing the first message$/, (model) => `${model}이(가) 첫 메시지를 작성 중`],
    [/^(.+) is answering$/, (model) => `${model}이(가) 응답 중`],
    [/^(.+) wrote the next message$/, (model) => `${model}이(가) 다음 메시지를 작성함`],
    [/^(\d+) queued$/, (count) => `${count}개 대기 중`],
    [/^(\d+) held$/, (count) => `${count}개 보류 중`]
  ];

  function t(value) {
    const text = String(value ?? '');
    if (text.includes('\n')) return text.split('\n').map(t).join('\n');
    if (text.includes(' — ')) {
      const parts = text.split(' — ');
      return parts.map(t).join(' — ');
    }
    const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match) return text;
    const normalized = match[2].replace(/\s+/g, ' ').trim();
    if (!normalized) return text;
    const exact = KO.get(normalized);
    if (exact) return `${match[1]}${exact}${match[3]}`;
    for (const [pattern, replacement] of PATTERNS) {
      const parts = normalized.match(pattern);
      if (parts) return `${match[1]}${replacement(...parts.slice(1))}${match[3]}`;
    }
    return text;
  }

  globalThis.CLF_KO = Object.freeze({ t });

  // The popup is entirely ours. On chatgpt.com, translate only extension-owned chrome;
  // never transcript, draft, tool evidence or user-entered goal text.
  const popup = location.protocol === 'chrome-extension:';
  const OWNED = '.clf-composer,.clf-menu,.clf-stage,.clf-boot,.clf-tip';
  const PROTECTED = '.clf-stage-body,.clf-menu-goal-text,.clf-menu-goal-input,.clf-tool,.clf-stream,textarea';
  const allowed = (element) =>
    popup || (Boolean(element?.closest(OWNED)) && !Boolean(element?.closest(PROTECTED)));

  function translateNode(root) {
    const nodes = [];
    if (root.nodeType === Node.TEXT_NODE) nodes.push(root);
    if (root.nodeType === Node.ELEMENT_NODE) nodes.push(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      nodes.push(node);
      node = walker.nextNode();
    }
    for (const current of nodes) {
      if (current.nodeType === Node.TEXT_NODE) {
        if (!allowed(current.parentElement)) continue;
        const translated = t(current.data);
        if (translated !== current.data) current.data = translated;
        continue;
      }
      if (!allowed(current)) continue;
      for (const attribute of ['title', 'aria-label', 'placeholder', 'data-clf-tip']) {
        const value = current.getAttribute(attribute);
        if (!value) continue;
        const translated = t(value);
        if (translated !== value) current.setAttribute(attribute, translated);
      }
    }
  }

  if (document.body) translateNode(document.body);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateNode(mutation.target);
      for (const node of mutation.addedNodes) translateNode(node);
    }
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
})();
