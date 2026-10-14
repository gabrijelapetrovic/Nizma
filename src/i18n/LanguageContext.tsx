'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useContent } from '../content/useContent';
import { MESSAGES, type Lang } from './translations';
import { LanguageContext, type LanguageContextValue } from './language-context';

const STORAGE_KEY = 'studio-lang';
const LEGACY_LANG_KEY = 'freedom-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { content } = useContent();
  const [lang, setLangState] = useState<Lang>('sr');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_LANG_KEY);
      if (stored === 'en' || stored === 'sr') setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'sr';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.removeItem(LEGACY_LANG_KEY);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const cmsCopy = useMemo(() => {
    const map = new Map<string, { sr: string; en: string }>();
    for (const row of content.copy ?? []) map.set(row.key, row);
    return map;
  }, [content.copy]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key: string) => {
        const row = cmsCopy.get(key);
        const fromCms = row?.[lang]?.trim();
        if (fromCms) return fromCms;
        return MESSAGES[lang][key] ?? MESSAGES.sr[key] ?? key;
      },
    }),
    [cmsCopy, lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
