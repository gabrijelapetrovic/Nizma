import { createContext } from 'react';
import { defaultSiteContent, type SiteContent } from './store';

export type ContentContextValue = {
  content: SiteContent;
  saveContent: (next: SiteContent) => void;
  resetContent: () => void;
};

export const ContentContext = createContext<ContentContextValue>({
  content: defaultSiteContent(),
  saveContent: () => undefined,
  resetContent: () => undefined,
});
