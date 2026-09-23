export type ThemePresetId = 'rose' | 'blush' | 'mauve' | 'nude' | 'berry' | 'zalfija' | 'custom';

export type ThemePalette = {
  bg: string;
  sand: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  gold: string;
  dark: string;
  sage: string;
};

export type SiteTheme = {
  preset: ThemePresetId;
  colors: ThemePalette;
};

const HEX = /^#([0-9a-fA-F]{6})$/;

export const THEME_PRESET_IDS: Exclude<ThemePresetId, 'custom'>[] = [
  'rose',
  'blush',
  'mauve',
  'nude',
  'berry',
  'zalfija',
];

const PRESET_ALIASES: Record<string, Exclude<ThemePresetId, 'custom'>> = {
  rose: 'rose',
  blush: 'blush',
  mauve: 'mauve',
  nude: 'nude',
  berry: 'berry',
  zalfija: 'zalfija',
  boho: 'rose',
  espresso: 'blush',
  sage: 'mauve',
  wine: 'nude',
  ocean: 'berry',
};

export const THEME_COLOR_KEYS: (keyof ThemePalette)[] = [
  'bg',
  'sand',
  'card',
  'text',
  'muted',
  'accent',
  'gold',
  'dark',
  'sage',
];

export const THEME_PRESETS: Record<Exclude<ThemePresetId, 'custom'>, ThemePalette> = {
  rose: {
    bg: '#FBF6F8',
    sand: '#F4E4EB',
    card: '#FFFFFF',
    text: '#2C1822',
    muted: '#7A5564',
    accent: '#C23B6E',
    gold: '#E7A8C0',
    dark: '#2A1520',
    sage: '#A85D78',
  },
  blush: {
    bg: '#FBF7F8',
    sand: '#F3E6EA',
    card: '#FFFFFF',
    text: '#2A1C22',
    muted: '#745864',
    accent: '#D4567C',
    gold: '#E8B4C4',
    dark: '#311820',
    sage: '#B56B84',
  },
  mauve: {
    bg: '#F8F4F7',
    sand: '#EFE4EC',
    card: '#FFFFFF',
    text: '#261820',
    muted: '#6E5666',
    accent: '#8E4A6A',
    gold: '#D4A3B8',
    dark: '#24141C',
    sage: '#9A6A80',
  },
  nude: {
    bg: '#FBF6F3',
    sand: '#F3E6DF',
    card: '#FFFFFF',
    text: '#2A1C18',
    muted: '#7A5E56',
    accent: '#C46B6B',
    gold: '#E2B4A8',
    dark: '#2C1816',
    sage: '#A86B62',
  },
  berry: {
    bg: '#F8F3F6',
    sand: '#F0E0E8',
    card: '#FFFFFF',
    text: '#24141C',
    muted: '#6E5060',
    accent: '#9B3060',
    gold: '#E0A0B8',
    dark: '#1C1016',
    sage: '#8A5070',
  },
  zalfija: {
    bg: '#F4F6F2',
    sand: '#E4EBE0',
    card: '#FFFFFF',
    text: '#1F2A1C',
    muted: '#5F6D5C',
    accent: '#2F5E38',
    gold: '#C4A35A',
    dark: '#152017',
    sage: '#6B8068',
  },
};

export function defaultSiteTheme(): SiteTheme {
  return { preset: 'rose', colors: { ...THEME_PRESETS.rose } };
}

export function normalizeHex(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!HEX.test(withHash)) return fallback;
  return withHash.toUpperCase();
}

export function parseSiteTheme(raw: unknown, fallback = defaultSiteTheme()): SiteTheme {
  if (!raw || typeof raw !== 'object') return fallback;
  const next = raw as Partial<SiteTheme>;
  const colorsIn =
    next.colors && typeof next.colors === 'object' ? (next.colors as Partial<ThemePalette>) : {};
  const colors = { ...fallback.colors };
  for (const key of THEME_COLOR_KEYS) {
    colors[key] = normalizeHex(colorsIn[key], fallback.colors[key]);
  }
  const aliased =
    typeof next.preset === 'string' ? PRESET_ALIASES[next.preset] : undefined;
  const preset = aliased && THEME_PRESET_IDS.includes(aliased) ? aliased : 'custom';
  const matchesPreset =
    preset !== 'custom' &&
    THEME_COLOR_KEYS.every((key) => colors[key].toLowerCase() === THEME_PRESETS[preset][key].toLowerCase());
  return { preset: matchesPreset ? preset : 'custom', colors };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function mix(a: string, b: string, amount: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * amount, ag + (bg - ag) * amount, ab + (bb - ab) * amount);
}

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export type ContrastIssue = { pair: string; ratio: number };

export function themeContrastIssues(colors: ThemePalette): ContrastIssue[] {
  const checks: [string, string, string, number][] = [
    ['text/bg', colors.text, colors.bg, 4.5],
    ['text/card', colors.text, colors.card, 4.5],
    ['white/accent', '#FFFFFF', colors.accent, 3],
    ['white/dark', '#FFFFFF', colors.dark, 3],
  ];
  return checks
    .map(([pair, fg, bg, min]) => ({ pair, ratio: contrastRatio(fg, bg), min }))
    .filter((item) => item.ratio < item.min)
    .map(({ pair, ratio }) => ({ pair, ratio }));
}

export function cssVarsFromPalette(colors: ThemePalette): Record<string, string> {
  return {
    '--studio-bg': colors.bg,
    '--studio-sand': colors.sand,
    '--studio-sand-light': mix(colors.bg, '#FFFFFF', 0.45),
    '--studio-sand-dark': mix(colors.sand, colors.text, 0.14),
    '--studio-terracotta': colors.accent,
    '--studio-terracotta-hover': mix(colors.accent, '#000000', 0.18),
    '--studio-terracotta-light': mix(colors.accent, '#FFFFFF', 0.88),
    '--studio-sage': colors.sage,
    '--studio-sage-light': mix(colors.sage, '#FFFFFF', 0.88),
    '--studio-gold': colors.gold,
    '--studio-dark': colors.dark,
    '--studio-ink': mix(colors.dark, '#FFFFFF', 0.08),
    '--studio-card': colors.card,
    '--studio-border': mix(colors.sand, colors.muted, 0.22),
    '--studio-text': colors.text,
    '--studio-muted': colors.muted,
  };
}

export function applySiteTheme(theme: SiteTheme | undefined) {
  if (typeof document === 'undefined') return;
  const vars = cssVarsFromPalette((theme || defaultSiteTheme()).colors);
  const root = document.documentElement;
  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', vars['--studio-dark']);
}
