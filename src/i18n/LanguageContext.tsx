import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MESSAGES, type Lang } from './translations';
import { LanguageContext, type LanguageContextValue } from './language-context';

const STORAGE_KEY = 'studio-lang';
const LEGACY_LANG_KEY = 'freedom-lang';

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_LANG_KEY);
    if (stored === 'en' || stored === 'sr') return stored;
  } catch {
    /* ignore */
  }
  return 'sr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'sr';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.removeItem(LEGACY_LANG_KEY);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key: string) => MESSAGES[lang][key] ?? MESSAGES.sr[key] ?? key,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
