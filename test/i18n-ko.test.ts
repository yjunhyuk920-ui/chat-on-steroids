import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { translateKo } from '../src/renderer/i18n-ko.js';

describe('Korean localization', () => {
  it('translates fixed and dynamic application chrome without changing unknown content', () => {
    expect(translateKo('Connect')).toBe('연결');
    expect(translateKo('  12 retained sessions  ')).toBe('  세션 12개 보관 중  ');
    expect(translateKo('사용자가 작성한 세션 내용')).toBe('사용자가 작성한 세션 내용');
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
});
