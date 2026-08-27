/** Korean presentation layer. Stored data, prompts and transcript text stay untouched. */
const KO = new Map<string, string>([
  ['Not set up yet', '아직 설정되지 않음'],
  ['Not connected', '연결되지 않음'],
  ['Connected', '연결됨'],
  ['Connect', '연결'],
  ['Disconnect browser', '브라우저 연결 해제'],
  ['Home', '홈'],
  ['Setup', '설정'],
  ['Chat', '채팅'],
  ['Activity', '활동'],
  ['Permissions', '권한'],
  ['Folders', '폴더'],
  ['Add', '추가'],
  ['Browse…', '찾아보기…'],
  ['Health', '상태 점검'],
  ['Run checks', '점검 실행'],
  ['Copy', '복사'],
  ['Copied', '복사됨'],
  ['Problems', '문제'],
  ['Read-only', '읽기 전용'],
  ['Restricted', '제한됨'],
  ['All', '전체'],
  ['None', '없음'],
  ['None yet', '아직 없음'],
  ['No session selected', '선택한 세션 없음'],
  ['Timeline', '타임라인'],
  ['Handoff', '인계'],
  ['Settings', '설정'],
  ['Goal', '목표'],
  ['Goal prompt', '목표 프롬프트'],
  ['Goal system prompt', '목표 시스템 프롬프트'],
  ['Goal driver prompt', '목표 실행 프롬프트'],
  ['System prompt', '시스템 프롬프트'],
  ['Edit prompt', '프롬프트 편집'],
  ['Restore default', '기본값 복원'],
  ['Model', '모델'],
  ['Select model', '모델 선택'],
  ['Reasoning', '추론 수준'],
  ['Default', '기본값'],
  ['Minimal', '최소'],
  ['Low', '낮음'],
  ['Medium', '보통'],
  ['High', '높음'],
  ['Create an API key', 'API 키 만들기'],
  ['OpenRouter API key', 'OpenRouter API 키'],
  ['Remove stored API key', '저장된 API 키 삭제'],
  ['Remove stored key', '저장된 키 삭제'],
  ['Tunnel API key', '터널 API 키'],
  ['Create a tunnel', '터널 만들기'],
  ['Start the tunnel', '터널 시작'],
  ['Tunnel program', '터널 프로그램'],
  ['Tunnels', '터널'],
  ['Tunnels: Read', '터널: 읽기'],
  ['Tunnels: Use', '터널: 사용'],
  ['Method', '방식'],
  ['OpenAI Secure MCP Tunnel (recommended)', 'OpenAI 보안 MCP 터널(권장)'],
  ['Cloudflare quick tunnel', 'Cloudflare 빠른 터널'],
  ['Local only — I run my own tunnel', '로컬 전용 — 직접 터널 실행'],
  ['No authentication', '인증 없음'],
  ['Pick a folder to share', '공유할 폴더 선택'],
  ['same workspace you use in ChatGPT', 'ChatGPT에서 사용하는 동일한 작업 폴더'],
  ['Add it in ChatGPT', 'ChatGPT에 추가'],
  ['Add the Chrome extension', 'Chrome 확장 프로그램 추가'],
  ['Developer mode', '개발자 모드'],
  ['Load unpacked', '압축해제된 확장 프로그램을 로드합니다'],
  ['Show all steps', '모든 단계 보기'],
  ['Keep running when closed', '창을 닫아도 계속 실행'],
  ['Connect automatically at startup', '시작할 때 자동 연결'],
  ['Privacy screenshots: default to the active window instead of the whole monitor', '개인정보 보호 스크린샷: 전체 모니터 대신 활성 창을 기본 대상으로 사용'],
  ['Keep recordings', '기록 보관'],
  ['Compact automatically', '자동으로 압축'],
  ['Sub-agent workers', '하위 에이전트 작업자'],
  ['Clear swarm', '에이전트 그룹 지우기'],
  ['Load 20 more', '20개 더 불러오기'],
  ['optional', '선택 사항'],
  ['days', '일'],
  ['tokens', '토큰'],
  ['max', '최대'],
  ['Required for sub-agents:', '하위 에이전트에 필요:'],
  ['Use the exact name and description from the card — copy them, do not invent your own.', '카드의 이름과 설명을 그대로 복사해 사용하세요.'],
  ['Then delete them. 0 keeps everything. Recording itself is a permission.', '기간이 지나면 삭제합니다. 0은 모든 기록을 보관합니다. 기록 자체도 권한입니다.'],
  ['Default lets the provider decide, which is right for nearly every model. The rest cost more and take longer.', '기본값은 제공자가 결정하며 대부분의 모델에 적합합니다. 다른 수준은 비용과 시간이 더 듭니다.'],
  ['Requires the Chrome extension to be loaded and connected. This sets the most worker chats one run may open.', 'Chrome 확장 프로그램을 로드하고 연결해야 합니다. 한 번에 열 수 있는 작업자 채팅의 최대 수를 정합니다.'],
  ['Used in chats with no goal of their own. The Goal model reads what you already asked for in the chat and keeps ChatGPT going until it is done.', '별도 목표가 없는 채팅에서 사용합니다. 목표 모델이 기존 요청을 읽고 완료될 때까지 ChatGPT를 계속 진행합니다.'],
  ['Used instead of the above once a chat carries its own goal. Drives ChatGPT towards that goal and writes the opening message of a new chat.', '채팅에 자체 목표가 있으면 위 프롬프트 대신 사용합니다. ChatGPT를 목표로 이끌고 새 채팅의 첫 메시지를 작성합니다.'],
  ['Saved when you leave the editor. Keep', '편집기를 벗어나면 저장됩니다.'],
  ['last ChatGPT call', '마지막 ChatGPT 호출'],
  ['verified link', '확인된 링크']
]);

const PATTERNS: Array<[RegExp, (...parts: string[]) => string]> = [
  [/^(\d+) retained sessions?$/, (count) => `세션 ${count}개 보관 중`],
  [/^(\d+) of (\d+) retained sessions? shown$/, (shown, total) => `보관된 세션 ${total}개 중 ${shown}개 표시`],
  [/^Connected · Port (\d+)$/, (port) => `연결됨 · 포트 ${port}`],
  [/^Port (\d+) · connecting$/, (port) => `포트 ${port} · 연결 중`],
  [/^(\d+)s ago$/, (seconds) => `${seconds}초 전`],
  [/^(\d+)m ago$/, (minutes) => `${minutes}분 전`],
  [/^(\d+)h ago$/, (hours) => `${hours}시간 전`]
];

export function translateKo(value: string): string {
  const text = String(value ?? '');
  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return text;
  const leading = match[1] ?? '';
  const body = match[2] ?? '';
  const trailing = match[3] ?? '';
  const normalized = body.replace(/\s+/g, ' ').trim();
  if (!normalized) return text;
  const exact = KO.get(normalized);
  if (exact) return `${leading}${exact}${trailing}`;
  for (const [pattern, replacement] of PATTERNS) {
    const parts = normalized.match(pattern);
    if (parts) return `${leading}${replacement(...parts.slice(1))}${trailing}`;
  }
  return text;
}

const PROTECTED = [
  '#timeline',
  '#handoffBox',
  '#homeFeed',
  '#fullFeed',
  '#goalObjective',
  '#goalPrompt',
  '#goalSystemPrompt',
  '#apiKey',
  '#tunnelApiKey',
  '#tunnelId',
  '#desktopTunnelId',
  '#tunnelProgram',
  'textarea',
  'pre',
  'code',
  '[data-no-i18n]'
].join(',');

function isProtected(element: Element | null): boolean {
  return Boolean(element?.closest(PROTECTED));
}

function translateText(node: Text): void {
  if (isProtected(node.parentElement)) return;
  const translated = translateKo(node.data);
  if (translated !== node.data) node.data = translated;
}

function translateElement(element: Element): void {
  if (isProtected(element)) return;
  for (const attribute of ['title', 'aria-label', 'placeholder']) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const translated = translateKo(value);
    if (translated !== value) element.setAttribute(attribute, translated);
  }
}

export function translateKoreanUi(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) translateText(root as Text);
  if (root.nodeType === Node.ELEMENT_NODE) translateElement(root as Element);
  // Use DOM constants directly so the same code works in Electron and the repository's
  // deliberately minimal JSDOM harness, which does not publish NodeFilter on globalThis.
  const walker = document.createTreeWalker(root, 1 | 4);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateText(node as Text);
    else translateElement(node as Element);
    node = walker.nextNode();
  }
}

export function installKoreanUi(): void {
  document.documentElement.lang = 'ko';
  if (document.body) translateKoreanUi(document.body);
  const Observer = document.defaultView?.MutationObserver;
  if (!Observer) return;
  const observer = new Observer((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateText(mutation.target as Text);
      for (const node of mutation.addedNodes) translateKoreanUi(node);
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
}

if (typeof document !== 'undefined') installKoreanUi();
