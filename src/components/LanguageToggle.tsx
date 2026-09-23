import { useLang } from '../i18n/useLang';

export function LanguageToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang, t } = useLang();
  const base = light
    ? 'border-white/20 text-white'
    : 'border-[var(--studio-border)] text-[var(--studio-text)]';
  const active = light ? 'bg-white text-[var(--studio-dark)]' : 'bg-[var(--studio-dark)] text-white';
  const idle = light ? 'hover:bg-white/10' : 'hover:bg-[var(--studio-sand)]';

  return (
    <div
      role="group"
      aria-label={t('lang.toggle')}
      className={`inline-flex rounded-full border overflow-hidden text-[11px] font-bold tracking-wide ${base}`}
    >
      <button
        type="button"
        aria-pressed={lang === 'sr'}
        onClick={() => setLang('sr')}
        className={`px-2.5 py-1 cursor-pointer ${lang === 'sr' ? active : idle}`}
      >
        {t('lang.sr')}
      </button>
      <button
        type="button"
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 cursor-pointer ${lang === 'en' ? active : idle}`}
      >
        {t('lang.en')}
      </button>
    </div>
  );
}
