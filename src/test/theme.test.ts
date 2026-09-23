import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  cssVarsFromPalette,
  defaultSiteTheme,
  normalizeHex,
  parseSiteTheme,
  themeContrastIssues,
  THEME_PRESETS,
} from '../content/theme';
import { parseStoredContent } from '../content/store';

describe('site theme', () => {
  it('keeps the rose palette as default and derives hover/border tokens', () => {
    const vars = cssVarsFromPalette(THEME_PRESETS.rose);
    expect(vars['--studio-terracotta']).toBe('#C23B6E');
    expect(vars['--studio-terracotta-hover']).toMatch(/^#[0-9A-F]{6}$/);
    expect(vars['--studio-terracotta-hover']).not.toBe('#C86446');
  });

  it('rejects invalid hex and maps a known preset', () => {
    expect(normalizeHex('not-a-color', '#FAF7F2')).toBe('#FAF7F2');
    expect(normalizeHex('c23b6e', '#000000')).toBe('#C23B6E');
    const parsed = parseSiteTheme({ preset: 'sage', colors: THEME_PRESETS.mauve });
    expect(parsed.preset).toBe('mauve');
    expect(parsed.colors.accent).toBe('#8E4A6A');
  });

  it('keeps every built-in palette readable', () => {
    for (const colors of Object.values(THEME_PRESETS)) {
      expect(themeContrastIssues(colors)).toEqual([]);
    }
  });

  it('marks a yellow-on-white palette as failing contrast', () => {
    const bad = {
      ...THEME_PRESETS.rose,
      text: '#EEEEEE',
      bg: '#FFFFFF',
      accent: '#F5E6A3',
    };
    expect(themeContrastIssues(bad).length).toBeGreaterThan(0);
    expect(contrastRatio('#2C1822', '#FBF6F8')).toBeGreaterThan(4.5);
  });

  it('reads theme from published JSON and defaults when omitted', () => {
    const withTheme = parseStoredContent(
      JSON.stringify({
        name: 'Test',
        theme: { preset: 'wine', colors: THEME_PRESETS.nude },
      })
    );
    expect(withTheme.theme.preset).toBe('nude');
    expect(withTheme.theme.colors.accent).toBe('#C46B6B');
    expect(parseStoredContent('{}').theme.preset).toBe(defaultSiteTheme().preset);
  });
});
