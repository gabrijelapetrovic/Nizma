import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  clearStoredSiteContent,
  fetchPublishedContent,
  defaultSiteContent,
  type SiteContent,
} from './store';
import { ContentContext, type ContentContextValue } from './content-context';
import { applySiteTheme } from './theme';

export function ContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(() => initialContent ?? defaultSiteContent());

  useEffect(() => {
    applySiteTheme(content.theme);
  }, [content.theme]);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      void fetchPublishedContent().then((published) => {
        if (cancelled) return;
        setContent((current) => (JSON.stringify(current) === JSON.stringify(published) ? current : published));
      });
    };
    const loadPublished = () => {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(start, { timeout: 2500 });
        return;
      }
      start();
    };
    if (document.readyState === 'complete') loadPublished();
    else window.addEventListener('load', loadPublished, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', loadPublished);
    };
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      saveContent: (next) => {
        setContent(next);
      },
      resetContent: () => {
        clearStoredSiteContent();
        setContent(defaultSiteContent());
        void fetchPublishedContent().then(setContent);
      },
    }),
    [content]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
