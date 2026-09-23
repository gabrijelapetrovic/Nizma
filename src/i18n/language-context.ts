import { createContext } from 'react';
import { MESSAGES, type Lang } from './translations';

export type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'sr',
  setLang: () => undefined,
  t: (key) => MESSAGES.sr[key] ?? key,
});
