import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import { translateKo, translateKoreanUi } from '../src/renderer/i18n-ko.js';

describe('Korean localization', () => {
  it('translates fixed and dynamic application chrome without changing unknown content', () => {
    expect(translateKo('Connect')).toBe('연결');
    expect(translateKo('  12 retained sessions  ')).toBe('  세션 12개 보관 중  ');
    expect(translateKo('사용자가 작성한 세션 내용')).toBe('사용자가 작성한 세션 내용');
  });

  it('translates every user-facing phrase visible on the home screen', () => {
    expect(translateKo('No tunnel yet')).toBe('아직 터널 없음');
    expect(translateKo('Look at files')).toBe('파일 보기');
    expect(translateKo('Change files')).toBe('파일 변경');
    expect(translateKo('See and use the desktop')).toBe('데스크톱 보기 및 사용');
    expect(translateKo('Run programs')).toBe('프로그램 실행');
    expect(translateKo('4 permissions')).toBe('권한 4개');
    expect(translateKo('1 permission')).toBe('권한 1개');
    expect(translateKo('Nothing shared yet. ChatGPT sees short names like /project — your real system paths are never sent.')).toBe(
      '아직 공유된 폴더가 없습니다. ChatGPT에는 /project 같은 짧은 이름만 표시되며 실제 시스템 경로는 전송되지 않습니다.'
    );
    expect(translateKo('Route to OpenAI')).toBe('OpenAI 연결 경로');
    expect(translateKo('Tools ChatGPT can see')).toBe('ChatGPT에서 볼 수 있는 도구');
    expect(translateKo('not running')).toBe('실행 중이 아님');
    expect(translateKo('9 available · 0 folders')).toBe('9개 사용 가능 · 폴더 0개');
    expect(translateKo('ChatGPT has not called this app yet.')).toBe('ChatGPT가 아직 이 앱을 호출하지 않았습니다.');
    expect(translateKo('Tools: observe, computer')).toBe('도구: observe, computer');
    expect(translateKo('Name')).toBe('이름');
    expect(translateKo('Required')).toBe('필수');
    expect(translateKo('required')).toBe('필수');
    expect(translateKo('Tunnel ID — Core connector')).toBe('터널 ID — 핵심 커넥터');
    expect(translateKo('Choose Tunnel, then pick this connector’s tunnel.')).toBe(
      '터널을 선택한 뒤 이 커넥터용 터널을 지정하세요.'
    );
  });

  it('loads the Korean extension layer before the recorder and popup logic', async () => {
    const root = process.cwd();
    const manifest = JSON.parse(await readFile(path.join(root, 'extension', 'manifest.json'), 'utf8'));
    const popup = await readFile(path.join(root, 'extension', 'popup.html'), 'utf8');
    const korean = JSON.parse(
      await readFile(path.join(root, 'extension', '_locales', 'ko', 'messages.json'), 'utf8')
    );

    expect(manifest.default_locale).toBe('ko');
    expect(manifest.name).toBe('__MSG_extensionName__');
    expect(manifest.content_scripts[0].js).toEqual(['chatgpt-dom.js', 'i18n-ko.js', 'content.js']);
    expect(popup.indexOf('i18n-ko.js')).toBeLessThan(popup.indexOf('popup.js'));
    expect(korean.extensionName.message).toContain('도우미');
  });

  it('removes the reported English copy from the real home-page markup', async () => {
    const html = await readFile(path.join(process.cwd(), 'src', 'renderer', 'index.html'), 'utf8');
    const dom = new JSDOM(html);
    const previousDocument = globalThis.document;
    const previousNode = globalThis.Node;
    Object.assign(globalThis, { document: dom.window.document, Node: dom.window.Node });
    try {
      translateKoreanUi(dom.window.document.body);
      const home = dom.window.document.querySelector('[data-panel="home"]')?.textContent ?? '';
      for (const english of ['Permissions', 'Nothing shared yet', 'Route to OpenAI', 'Tools ChatGPT can see']) {
        expect(home).not.toContain(english);
      }
      expect(home).toContain('권한');
      expect(home).toContain('아직 공유된 폴더가 없습니다');
    } finally {
      Object.assign(globalThis, { document: previousDocument, Node: previousNode });
      dom.window.close();
    }
  });

  it('translates dynamic health values rendered in code elements without changing other code', () => {
    const dom = new JSDOM(`
      <div id="facts">
        <div class="fact"><span>Route to OpenAI</span><code title="not running">not running</code></div>
        <div class="fact"><span>Tools ChatGPT can see</span><code>9 available · 0 folders</code></div>
      </div>
      <p>Keep <code id="protocol-value">NO_REPLY</code> unchanged.</p>
    `);
    const previousDocument = globalThis.document;
    const previousNode = globalThis.Node;
    Object.assign(globalThis, { document: dom.window.document, Node: dom.window.Node });
    try {
      translateKoreanUi(dom.window.document.body);
      expect(dom.window.document.querySelector('#facts')?.textContent).toContain('실행 중이 아님');
      expect(dom.window.document.querySelector('#facts')?.textContent).toContain('9개 사용 가능 · 폴더 0개');
      expect(dom.window.document.querySelector('#facts code')?.getAttribute('title')).toBe('실행 중이 아님');
      expect(dom.window.document.querySelector('#protocol-value')?.textContent).toBe('NO_REPLY');
    } finally {
      Object.assign(globalThis, { document: previousDocument, Node: previousNode });
      dom.window.close();
    }
  });
});
