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
  ['required', '필수'],
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
  ['verified link', '확인된 링크'],
  ['No tunnel yet', '아직 터널 없음'],
  ['Look at files', '파일 보기'],
  ['Change files', '파일 변경'],
  ['See and use the desktop', '데스크톱 보기 및 사용'],
  ['Run programs', '프로그램 실행'],
  ['Read and search inside the folders you approved.', '허용한 폴더 안의 파일을 읽고 검색합니다.'],
  ['Create, edit, move and delete, inside those folders only.', '허용한 폴더 안에서만 파일을 만들고 편집·이동·삭제합니다.'],
  ['Screenshots, the list of open windows, and the mouse and keyboard.', '스크린샷, 열린 창 목록, 마우스와 키보드를 사용합니다.'],
  ['Start commands as you. The most powerful setting here.', '사용자 권한으로 명령을 실행합니다. 가장 강력한 설정입니다.'],
  ['Browse folders', '폴더 탐색'],
  ['Search files', '파일 검색'],
  ['Read files', '파일 읽기'],
  ['File metadata', '파일 정보'],
  ['Create files', '파일 만들기'],
  ['Edit files', '파일 편집'],
  ['Move / rename', '이동 / 이름 변경'],
  ['Delete files', '파일 삭제'],
  ['Run commands', '명령 실행'],
  ['See the screen', '화면 보기'],
  ['Control mouse and keyboard', '마우스와 키보드 제어'],
  ['Read clipboard', '클립보드 읽기'],
  ['Write clipboard', '클립보드 쓰기'],
  ['List what is inside an approved folder.', '허용한 폴더의 내용을 나열합니다.'],
  ['Find files by name or glob, and text inside them.', '이름이나 패턴으로 파일과 파일 안의 텍스트를 찾습니다.'],
  ['Read text in ranges, and open local images into vision.', '지정 범위의 텍스트를 읽고 로컬 이미지를 분석합니다.'],
  ['Size, dates and line count, without the contents.', '내용을 제외한 크기, 날짜, 줄 수를 확인합니다.'],
  ['Add new files, and the folders they need.', '새 파일과 필요한 폴더를 만듭니다.'],
  ['Exact edits, applied atomically across files.', '여러 파일에 정확한 편집을 원자적으로 적용합니다.'],
  ['Move or rename, both ends inside approved folders.', '허용한 폴더 안에서 파일을 이동하거나 이름을 바꿉니다.'],
  ['Permanent — there is no Recycle Bin.', '영구 삭제됩니다. 휴지통을 거치지 않습니다.'],
  ['Run anything as you. NOT limited to approved folders.', '사용자 권한으로 무엇이든 실행합니다. 허용 폴더로 제한되지 않습니다.'],
  ['Screenshots, open windows, and the controls on them.', '스크린샷과 열린 창 및 창의 컨트롤을 확인합니다.'],
  ['Moves the pointer, clicks, types and presses keys, as you.', '사용자 대신 포인터 이동, 클릭, 입력, 키 누르기를 수행합니다.'],
  ['Read the current clipboard text.', '현재 클립보드의 텍스트를 읽습니다.'],
  ['Replace the clipboard without focus or keystrokes.', '포커스나 키 입력 없이 클립보드 내용을 바꿉니다.'],
  ['Session recording', '세션 기록'],
  ['Sub-agents', '하위 에이전트'],
  ['Record this chat locally, and expose the session tool in ChatGPT', '이 채팅을 로컬에 기록하고 ChatGPT에 세션 도구를 공개'],
  ['Expose or hide the sub-agent tools in ChatGPT', 'ChatGPT에서 하위 에이전트 도구 표시 또는 숨기기'],
  ['List recent recordings or find past and concurrent work by text.', '최근 기록을 나열하거나 텍스트로 이전·동시 작업을 찾습니다.'],
  ['Read one explicit recording, continue it, or expand one short T… tool reference.', '특정 기록을 읽거나 이어서 작업하고 짧은 T… 도구 참조를 펼칩니다.'],
  ['Open worker ChatGPT conversations for parts of the task, on one shared context.', '공유 컨텍스트에서 작업 일부를 맡을 ChatGPT 작업자 대화를 엽니다.'],
  ['Steer one worker or several at once, or report back to prime.', '한 명 또는 여러 작업자에게 지시하거나 주 에이전트에 보고합니다.'],
  ['See every worker, and collect messages not yet delivered on a tool result.', '모든 작업자를 확인하고 아직 전달되지 않은 메시지를 수집합니다.'],
  ['Hand the worker result back to prime and close that slot.', '작업자 결과를 주 에이전트에 전달하고 슬롯을 닫습니다.'],
  ['off', '꺼짐'],
  ['off in read-only mode', '읽기 전용 모드에서 꺼짐'],
  ['session tool exposed', '세션 도구 공개됨'],
  ['agents tool exposed', '에이전트 도구 공개됨'],
  ['Nothing shared yet. ChatGPT sees short names like /project — your real system paths are never sent.', '아직 공유된 폴더가 없습니다. ChatGPT에는 /project 같은 짧은 이름만 표시되며 실제 시스템 경로는 전송되지 않습니다.'],
  ['Nothing shared yet. ChatGPT sees short names like', '아직 공유된 폴더가 없습니다. ChatGPT에는 다음과 같은 짧은 이름만 표시됩니다.'],
  ['— your real system paths are never sent.', '— 실제 시스템 경로는 전송되지 않습니다.'],
  ['Route to OpenAI', 'OpenAI 연결 경로'],
  ['Tools ChatGPT can see', 'ChatGPT에서 볼 수 있는 도구'],
  ['not running', '실행 중이 아님'],
  ['starting…', '시작 중…'],
  ['Poll errors', '폴링 오류'],
  ['Tunnel → this app', '터널 → 이 앱'],
  ['checking…', '확인 중…'],
  ['Tunnel uptime', '터널 실행 시간'],
  ['ChatGPT ran a tool', 'ChatGPT 도구 실행'],
  ['never — check Developer mode', '실행 기록 없음 — 개발자 모드를 확인하세요'],
  ['Tunnel client', '터널 클라이언트'],
  ['Local server', '로컬 서버'],
  ['no handshake yet', '아직 핸드셰이크 없음'],
  ['Disconnected', '연결되지 않음'],
  ['Starting', '시작 중'],
  ['Connecting', '연결 중'],
  ['No internet', '인터넷 연결 없음'],
  ['Sign-in failed', '로그인 실패'],
  ['Tunnel unavailable', '터널 사용 불가'],
  ['Switch to light mode', '라이트 모드로 전환'],
  ['Switch to dark mode', '다크 모드로 전환'],
  ['Six steps, once. Custom MCP apps need ChatGPT Developer mode on the web. Full write/modify MCP is currently available to Business, Enterprise and Edu; Pro custom MCP is limited to read/fetch access.', '한 번만 진행하면 되는 6단계 설정입니다. 사용자 지정 MCP 앱을 사용하려면 웹 ChatGPT에서 개발자 모드를 켜야 합니다. 전체 쓰기·수정 MCP는 현재 Business, Enterprise, Edu에서 제공되며 Pro의 사용자 지정 MCP는 읽기·가져오기로 제한됩니다.'],
  ['Six steps, once. Custom MCP apps need ChatGPT', '한 번만 진행하면 되는 6단계 설정입니다. 사용자 지정 MCP 앱을 사용하려면 ChatGPT에서'],
  ['on the web. Full write/modify MCP is currently available to Business, Enterprise and Edu; Pro custom MCP is limited to read/fetch access.', '를 켜야 합니다. 전체 쓰기·수정 MCP는 현재 Business, Enterprise, Edu에서 제공되며 Pro는 읽기·가져오기로 제한됩니다.'],
  ['Pick a folder to share', '공유할 폴더 선택'],
  ['Nothing outside the folders you approve is reachable. Do this first — the tunnel will not start with nothing to serve.', '허용한 폴더 밖에는 접근할 수 없습니다. 먼저 폴더를 선택해야 터널을 시작할 수 있습니다.'],
  ['Choose folder', '폴더 선택'],
  ['Open Tunnels', '터널 열기'],
  ['Open API keys', 'API 키 열기'],
  ['Open Apps', '앱 설정 열기'],
  ['Open extension folder', '확장 프로그램 폴더 열기'],
  ['Download extension ZIP', '확장 프로그램 ZIP 다운로드'],
  ['Open Tunnels on the OpenAI platform and create one. Pick the same workspace you use in ChatGPT — a tunnel in another workspace will not show up later. Then copy its ID.', 'OpenAI 플랫폼의 터널 설정에서 터널을 만드세요. ChatGPT에서 사용하는 동일한 워크스페이스를 선택한 후 터널 ID를 복사합니다.'],
  ['Open', '열기'],
  ['on the OpenAI platform and create one. Pick the', 'OpenAI 플랫폼에서 터널을 하나 만들고'],
  ['— a tunnel in another workspace will not show up later. Then copy its ID.', '를 선택하세요. 다른 워크스페이스의 터널은 표시되지 않습니다. 그런 다음 ID를 복사하세요.'],
  ['Screen and mouse/keyboard control are a separate connector, so they need a second tunnel. Create another one and paste its ID here. Leave it empty to keep desktop control off in ChatGPT.', '화면 및 마우스·키보드 제어는 별도 커넥터이므로 두 번째 터널이 필요합니다. 새 터널을 만들고 ID를 여기에 붙여 넣으세요. 비워 두면 ChatGPT의 데스크톱 제어가 꺼집니다.'],
  ['Create a key of type', '다음 유형의 키를 만드세요:'],
  ['and give it only', '권한은 다음 두 가지만 허용하세요:'],
  ['and', '및'],
  ['Leave everything else on', '나머지는 모두 다음으로 설정하세요:'],
  ['Copy it once — the platform will not show it again.', '키는 다시 표시되지 않으므로 한 번 복사해 두세요.'],
  ['Leave it running while you use the connector. It stays available when you close the window.', '커넥터를 사용하는 동안 앱을 실행해 두세요. 창을 닫아도 계속 사용할 수 있습니다.'],
  ['Turn on', '다음을 켜세요:'],
  ['in ChatGPT — currently under', 'ChatGPT의 다음 위치에 있습니다:'],
  [', with workspace-managed plans also exposing custom apps from their Apps area. Then create one app per card below — the required one, plus the optional desktop one if you want it. Each card is a separate app in ChatGPT:', '워크스페이스 관리 요금제에서는 앱 영역에서도 사용자 지정 앱을 사용할 수 있습니다. 아래 카드마다 앱을 하나씩 만드세요. 필수 앱과 원하는 경우 선택 사항인 데스크톱 앱을 추가합니다.'],
  ['For authentication, scroll to the very bottom and pick', '인증 설정은 맨 아래로 내려가 다음을 선택하세요:'],
  ['This app is protected by a secret address, not by a login.', '이 앱은 로그인 대신 비밀 주소로 보호됩니다.'],
  ['Open chrome://extensions, turn on Developer mode, choose Load unpacked and pick the folder the button opens. It pairs with this app by itself — there is no code to type.', 'chrome://extensions를 열고 개발자 모드를 켠 뒤 압축해제된 확장 프로그램을 로드합니다를 선택하여 버튼이 여는 폴더를 지정하세요. 코드를 입력하지 않아도 앱과 자동으로 연결됩니다.'],
  ['Open', '열기'],
  [', turn on', '에서 다음을 켜고'],
  [', choose', '다음을 선택한 후'],
  ['and pick the folder the button opens. It pairs with this app by itself — there is no code to type.', '버튼이 여는 폴더를 선택하세요. 코드를 입력하지 않아도 앱과 자동 연결됩니다.'],
  ['the companion extension must be loaded and connected in ChatGPT. Without it, Chat On Steroids cannot identify, open or coordinate worker chats.', '도우미 확장 프로그램을 로드하고 ChatGPT에 연결해야 합니다. 확장 프로그램이 없으면 작업자 채팅을 식별·열기·조율할 수 없습니다.'],
  ['Advanced — method, program, startup', '고급 — 방식, 프로그램, 시작 설정'],
  ['Bundled with this app', '앱에 포함됨'],
  ['ChatGPT reaches this computer through an OpenAI tunnel. Nothing is exposed to the open internet.', 'ChatGPT가 OpenAI 터널을 통해 이 컴퓨터에 연결합니다. 공개 인터넷에 노출되지 않습니다.'],
  ['Creates a temporary public https address with Cloudflare. The address changes on every restart.', 'Cloudflare로 임시 공개 HTTPS 주소를 만듭니다. 다시 시작할 때마다 주소가 바뀝니다.'],
  ['This app only listens on localhost. You are responsible for exposing it.', '이 앱은 localhost에서만 수신합니다. 외부 공개는 사용자가 직접 관리해야 합니다.'],
  ['Sessions', '세션'],
  ['Refresh', '새로고침'],
  ['Nothing recorded yet. Turn on recording in Settings, pair the Chrome extension, and this fills up as you work in ChatGPT.', '아직 기록이 없습니다. 설정에서 기록을 켜고 Chrome 확장 프로그램을 연결하면 ChatGPT 작업 내용이 여기에 쌓입니다.'],
  ['Chat settings', '채팅 설정'],
  ['No events for this session yet. Tool calls are recorded here as they happen; what ChatGPT shows on screen arrives from the browser extension.', '아직 이 세션에 이벤트가 없습니다. 도구 호출은 발생 즉시 기록되며 ChatGPT 화면 내용은 브라우저 확장 프로그램을 통해 들어옵니다.'],
  ['Latest handoff', '최근 인계'],
  ['Open OpenRouter keys', 'OpenRouter 키 열기'],
  ['Close prompt', '프롬프트 닫기'],
  ['Close', '닫기'],
  ['Text', '텍스트'],
  ['Untitled session', '제목 없는 세션'],
  ['Delete this recorded session', '이 기록된 세션 삭제'],
  ['Session deleted', '세션이 삭제되었습니다'],
  ['Recording is off', '기록 꺼짐'],
  ['scroll for older history', '이전 기록을 보려면 스크롤'],
  ['one live now', '현재 1개 진행 중'],
  ['Arguments', '인수'],
  ['Result', '결과'],
  ['You', '나'],
  ['ChatGPT (partial)', 'ChatGPT(작성 중)'],
  ['Turn started', '응답 시작'],
  ['Unknown event', '알 수 없는 이벤트'],
  ['Unattributed', '분류되지 않음'],
  ['Extension folder', '확장 프로그램 폴더'],
  ['Loading models from OpenRouter…', 'OpenRouter에서 모델을 불러오는 중…'],
  ['OpenRouter could not be reached. The model in use is unchanged.', 'OpenRouter에 연결할 수 없습니다. 사용 중인 모델은 변경되지 않았습니다.'],
  ['No models came back.', '불러온 모델이 없습니다.'],
  ['release date not published', '출시일 정보 없음'],
  ['Turn on session recording first — Goal needs the recorded conversation to decide what is still missing.', '먼저 세션 기록을 켜세요. 목표 기능은 기록된 대화를 읽어 남은 작업을 판단합니다.'],
  ['OpenRouter API key essential for goal feature.', '목표 기능에는 OpenRouter API 키가 필요합니다.'],
  ['A second model reads each finished answer and writes your next message, until it decides the goal is met.', '두 번째 모델이 완료된 답변을 읽고 목표 달성 시점까지 다음 메시지를 작성합니다.'],
  ['Off — nothing is sent to OpenRouter and nothing is typed into your chats.', '꺼짐 — OpenRouter로 전송하거나 채팅에 입력하는 내용이 없습니다.'],
  ['A key is stored with secure OS credential storage. Type a new one to replace it.', '키가 운영체제의 보안 자격 증명 저장소에 보관되어 있습니다. 교체하려면 새 키를 입력하세요.'],
  ['Stored with secure OS credential storage. It never leaves this app, and the browser is only ever handed the reply.', '운영체제의 보안 자격 증명 저장소에 보관됩니다. 키는 앱 밖으로 나가지 않으며 브라우저에는 응답만 전달됩니다.'],
  ['Goal prompt restored to default', '목표 프롬프트를 기본값으로 복원했습니다'],
  ['Goal driver prompt restored to default', '목표 실행 프롬프트를 기본값으로 복원했습니다'],
  ['OpenRouter key stored', 'OpenRouter 키를 저장했습니다'],
  ['OpenRouter key removed', 'OpenRouter 키를 삭제했습니다'],
  ['Interrupts the answer at this many tokens, writes a handoff, opens a fresh chat. Once per chat.', '이 토큰 수에 도달하면 답변을 중단하고 인계를 작성한 뒤 새 채팅을 엽니다. 채팅당 한 번 실행됩니다.'],
  ['Off — only the Compact & resume button in the ChatGPT tab compacts.', '꺼짐 — ChatGPT 탭의 압축 및 이어하기 버튼으로만 압축합니다.'],
  ['Browser-backed features are off. The extension is not needed right now.', '브라우저 연동 기능이 꺼져 있어 지금은 확장 프로그램이 필요하지 않습니다.'],
  ['Secure credential storage is unavailable, so the extension cannot pair safely.', '보안 자격 증명 저장소를 사용할 수 없어 확장 프로그램을 안전하게 연결할 수 없습니다.'],
  ['The local bridge is off even though recording or multi-agent mode needs it.', '기록 또는 다중 에이전트 모드에 필요하지만 로컬 브리지가 꺼져 있습니다.'],
  ['The extension folder is missing from this installation. Reinstall the app, or use the extension/ folder from a source checkout.', '설치 경로에 확장 프로그램 폴더가 없습니다. 앱을 다시 설치하거나 소스의 extension 폴더를 사용하세요.'],
  ['No agents. The prime agent creates workers with the agents tool’s spawn action.', '에이전트가 없습니다. 주 에이전트가 agents 도구의 spawn 동작으로 작업자를 만듭니다.'],
  ['No workers are running. Reusable worker histories are parked and remain available to their prime chats; Clear swarm permanently removes them.', '실행 중인 작업자가 없습니다. 재사용 가능한 작업자 기록은 주 채팅에서 계속 사용할 수 있으며 에이전트 그룹 지우기를 누르면 영구 삭제됩니다.'],
  ['Work this app could not place in a chat — driven from another device, or with no ChatGPT tab open', '채팅에 연결하지 못한 작업 — 다른 기기에서 실행했거나 ChatGPT 탭이 열려 있지 않음'],
  ['Not set up', '설정되지 않음'],
  ['Not connected yet', '아직 연결되지 않음'],
  ['A key is stored with secure OS credential storage. Type a new one to replace it, or use Remove stored API key.', '키가 운영체제의 보안 자격 증명 저장소에 보관되어 있습니다. 새 키를 입력해 교체하거나 저장된 API 키 삭제를 사용하세요.'],
  ['Stored with secure OS credential storage. It is never shown again and never leaves this app.', '운영체제의 보안 자격 증명 저장소에 보관됩니다. 다시 표시되지 않으며 앱 밖으로 나가지 않습니다.'],
  ['Hide finished steps', '완료된 단계 숨기기'],
  ['Recent activity only — no file contents, no credentials.', '최근 활동만 표시 — 파일 내용과 인증 정보는 제외됩니다.'],
  ['NAME', '이름'],
  ['DESCRIPTION', '설명'],
  ['Name', '이름'],
  ['Description', '설명'],
  ['Tunnel ID — Core connector', '터널 ID — 핵심 커넥터'],
  ['Tunnel ID — Desktop connector', '터널 ID — 데스크톱 커넥터'],
  ['REQUIRED', '필수'],
  ['Required', '필수'],
  ['Optional', '선택 사항'],
  ['Name copied', '이름을 복사했습니다'],
  ['Description copied', '설명을 복사했습니다'],
  ['URL copied', 'URL을 복사했습니다'],
  ['Files, patches and the terminal. Required — this is the coding connector.', '파일, 패치, 터미널을 사용하는 필수 코딩 커넥터입니다.'],
  ['Screenshots, windows, mouse/keyboard control and the clipboard. Optional — connect it only if you want desktop automation.', '스크린샷, 창, 마우스·키보드 제어 및 클립보드를 사용하는 선택형 데스크톱 자동화 커넥터입니다.'],
  ['Choose Tunnel, then pick this connector’s tunnel.', '터널을 선택한 뒤 이 커넥터용 터널을 지정하세요.'],
  ['Pick this connector’s own tunnel — paste its ID in step 2 first.', '이 커넥터 전용 터널을 선택하세요. 먼저 2단계에 터널 ID를 붙여 넣어야 합니다.'],
  ["Pick this connector's own tunnel — paste its ID in step 2 first.", '이 커넥터 전용 터널을 선택하세요. 먼저 2단계에 터널 ID를 붙여 넣어야 합니다.'],
  ['ChatGPT has not called this app yet.', 'ChatGPT가 아직 이 앱을 호출하지 않았습니다.'],
  ['For the connection, choose', '연결 방식은 다음을 선택하세요:'],
  ['and pick the tunnel you made in step 2.', '그런 다음 2단계에서 만든 터널을 지정하세요.'],
  ['For the connection, paste the URL below into', '연결하려면 아래 URL을 다음 항목에 붙여 넣으세요:'],
  ['. Leave everything else on', '. 나머지는 모두 다음으로 설정하세요:'],
  ['. Copy it once — the platform will not show it again.', '. 키는 다시 표시되지 않으므로 한 번 복사해 두세요.'],
  ['. This app is protected by a secret address, not by a login.', '. 이 앱은 로그인 대신 비밀 주소로 보호됩니다.'],
  ['Choose a folder to share — step 1.', '공유할 폴더를 선택하세요 — 1단계.'],
  ['Create a tunnel and paste its ID — step 2.', '터널을 만들고 ID를 붙여 넣으세요 — 2단계.'],
  ['Add a restricted API key — step 3.', '제한된 API 키를 추가하세요 — 3단계.'],
  ['Secure credential storage is unavailable.', '보안 자격 증명 저장소를 사용할 수 없습니다.'],
  ['cloudflared was not found on this computer.', '이 컴퓨터에서 cloudflared를 찾을 수 없습니다.'],
  ['Leave it running while you use the connector. It stays in the tray when you close the window.', '커넥터를 사용하는 동안 앱을 실행해 두세요. 창을 닫으면 시스템 트레이에서 계속 실행됩니다.'],
  ['Keep running in the tray when closed', '창을 닫아도 시스템 트레이에서 계속 실행'],
  ['Leave it running while you use the connector. It stays available from the menu bar and Dock when you close the window.', '커넥터를 사용하는 동안 앱을 실행해 두세요. 창을 닫아도 메뉴 막대와 Dock에서 계속 사용할 수 있습니다.'],
  ['Hide the window to the menu bar when closed', '창을 닫으면 메뉴 막대로 숨기기'],
  ['Not published', '게시되지 않음'],
  ['Connecting…', '연결 중…'],
  ['Published', '게시됨'],
  ['Problem', '문제'],
  ['Not needed for this method.', '이 방식에는 필요하지 않습니다.'],
  ['Not found. Install it, or choose the file with Browse.', '찾을 수 없습니다. 설치하거나 찾아보기로 파일을 선택하세요.'],
  ['Recent activity only. File contents and credentials are never recorded.', '최근 활동만 표시합니다. 파일 내용과 인증 정보는 기록하지 않습니다.'],
  ['renderer', '렌더러'],
  ['window', '창'],
  ['app', '앱'],
  ['bridge', '브리지'],
  ['state ready', '상태 준비 완료'],
  ['loaded', '로드됨'],
  ['started', '시작됨'],
  ['never', '기록 없음'],
  ['just now', '방금'],
  ['now', '지금']
]);

const PATTERNS: Array<[RegExp, (...parts: string[]) => string]> = [
  [/^(\d+) retained sessions?$/, (count) => `세션 ${count}개 보관 중`],
  [/^(\d+) of (\d+) retained sessions? shown$/, (shown, total) => `보관된 세션 ${total}개 중 ${shown}개 표시`],
  [/^(\d+) permissions?$/, (count) => `권한 ${count}개`],
  [/^(\d+) of (\d+) permissions$/, (on, total) => `권한 ${total}개 중 ${on}개`],
  [/^(\d+) available · (\d+) folders?$/, (tools, folders) => `${tools}개 사용 가능 · 폴더 ${folders}개`],
  [/^(\d+) problems?$/, (count) => `문제 ${count}개`],
  [/^verified (.+)$/, (age) => `${age}에 확인`],
  [/^listening on (.+)$/, (address) => `${address}에서 수신 대기 중`],
  [/^Using (.+)$/, (binary) => `${binary} 사용 중`],
  [/^(\d+) messages?$/, (count) => `메시지 ${count}개`],
  [/^(\d+) tools?$/, (count) => `도구 ${count}개`],
  [/^(\d+) errors?$/, (count) => `오류 ${count}개`],
  [/^(\d+) agents?$/, (count) => `에이전트 ${count}개`],
  [/^(\d+) events?$/, (count) => `이벤트 ${count}개`],
  [/^showing the last (\d+)$/, (count) => `최근 ${count}개 표시`],
  [/^(\d+) newest rendered$/, (count) => `최신 ${count}개 렌더링`],
  [/^~(.+) rough context tokens$/, (count) => `대략적인 컨텍스트 토큰 ~${count}`],
  [/^Showing the (\d+) newest of (\d+), newest release first\.$/, (shown, total) => `전체 ${total}개 중 최신 ${shown}개 표시`],
  [/^Extension folder: (.+)$/, (path) => `확장 프로그램 폴더: ${path}`],
  [/^Goal model set to (.+)$/, (model) => `목표 모델을 ${model}(으)로 설정했습니다`],
  [/^Connected\. Listening on (.+) · last message (.+)\.$/, (address, age) => `연결됨. ${address}에서 수신 중 · 마지막 메시지 ${age}`],
  [/^Listening on (.+) · no browser is authorized or connected yet\.$/, (address) => `${address}에서 수신 중 · 아직 승인되거나 연결된 브라우저가 없습니다.`],
  [/^Tools: (.+)$/, (tools) => `도구: ${tools}`],
  [/^Turn everything in "(.+)" on or off$/, (group) => `“${translateKo(group)}”의 모든 권한 켜기 또는 끄기`],
  [/^Rename \/(.+)$/, (name) => `/${name} 이름 변경`],
  [/^Stop sharing \/(.+)$/, (name) => `/${name} 공유 중지`],
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
  for (const separator of [' · ', '\n']) {
    if (!normalized.includes(separator)) continue;
    const translated = normalized.split(separator).map((part) => translateKo(part)).join(separator);
    if (translated !== normalized) return `${leading}${translated}${trailing}`;
  }
  return text;
}

const PROTECTED = [
  '#timeline',
  '#handoffBox',
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
  // Health fact values use <code> for monospace alignment, but they are application
  // status text rather than user-authored code. Allow those controlled values through
  // while preserving every other code/pre block verbatim.
  if (element?.closest('#facts')) return false;
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
      if (mutation.type === 'attributes') translateElement(mutation.target as Element);
      for (const node of mutation.addedNodes) translateKoreanUi(node);
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['title', 'aria-label', 'placeholder']
  });
}

if (
  typeof document !== 'undefined' &&
  !document.defaultView?.navigator.userAgent.toLowerCase().includes('jsdom')
) {
  installKoreanUi();
}
