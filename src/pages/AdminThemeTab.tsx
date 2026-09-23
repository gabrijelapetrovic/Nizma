import {
  THEME_COLOR_KEYS,
  THEME_PRESETS,
  THEME_PRESET_IDS,
  applySiteTheme,
  defaultSiteTheme,
  themeContrastIssues,
  type SiteTheme,
  type ThemePalette,
  type ThemePresetId,
} from '../content/theme';
import { useLang } from '../i18n/useLang';

type AdminThemeTabProps = {
  theme: SiteTheme;
  onChange: (theme: SiteTheme) => void;
};

export function AdminThemeTab({ theme, onChange }: AdminThemeTabProps) {
  const { t } = useLang();
  const issues = themeContrastIssues(theme.colors);

  const setPreset = (id: Exclude<ThemePresetId, 'custom'>) => {
    const next = { preset: id, colors: { ...THEME_PRESETS[id] } };
    onChange(next);
    applySiteTheme(next);
  };

  const setColor = (key: keyof ThemePalette, value: string) => {
    const colors = { ...theme.colors, [key]: value };
    const next = { preset: 'custom' as const, colors };
    onChange(next);
    applySiteTheme(next);
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-4">
      <h2 className="font-serif font-bold text-lg">{t('admin.theme')}</h2>
      <p className="text-xs text-[var(--studio-muted)] leading-relaxed">{t('admin.themeHint')}</p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {THEME_PRESET_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setPreset(id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              theme.preset === id
                ? 'bg-[var(--studio-terracotta)] text-white border-transparent'
                : 'bg-white border-[var(--studio-border)] text-[var(--studio-text)]'
            }`}
          >
            {t(`admin.preset.${id}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEME_COLOR_KEYS.map((key) => (
          <label key={key} className="flex items-center gap-3 text-xs font-semibold">
            <input
              type="color"
              value={theme.colors[key]}
              onChange={(e) => setColor(key, e.target.value.toUpperCase())}
              className="h-10 w-12 rounded-lg border border-[var(--studio-border)] bg-white p-0.5 cursor-pointer"
            />
            <span className="flex-1">{t(`admin.theme.${key}`)}</span>
            <span className="font-normal text-[var(--studio-muted)]">{theme.colors[key]}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-3 py-1.5 rounded-full bg-[var(--studio-terracotta)] text-white">{t('cta.reserve')}</span>
        <span className="px-3 py-1.5 rounded-full bg-[var(--studio-dark)] text-white">{t('admin.theme.dark')}</span>
        <span className="px-3 py-1.5 rounded-full bg-[var(--studio-sand)] text-[var(--studio-text)] border border-[var(--studio-border)]">
          {t('admin.themeSand')}
        </span>
      </div>

      {issues.length ? (
        <p className="text-xs text-red-600 leading-relaxed">{t('admin.themeContrastFail')}</p>
      ) : (
        <p className="text-xs text-emerald-700">{t('admin.themeContrastOk')}</p>
      )}

      <button
        type="button"
        onClick={() => {
          const next = defaultSiteTheme();
          onChange(next);
          applySiteTheme(next);
        }}
        className="text-xs font-semibold text-[var(--studio-terracotta)]"
      >
        {t('admin.themeReset')}
      </button>
    </section>
  );
}
