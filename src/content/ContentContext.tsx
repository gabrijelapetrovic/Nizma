import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  clearStoredSiteContent,
  fetchPublishedContent,
  loadSiteContent,
  saveSiteContent,
  CONTENT_STORAGE_KEY,
  defaultSiteContent,
  type SiteContent,
} from './store';
import { clearPhotos } from './imageStore';
import { ContentContext, type ContentContextValue } from './content-context';
import { applySiteTheme } from './theme';

function isAdminRoute() {
  return window.location.hash.replace('#', '').startsWith('admin');
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() =>
    typeof window !== 'undefined' && isAdminRoute() ? loadSiteContent() : defaultSiteContent()
  );

  useEffect(() => {
    applySiteTheme(content.theme);
  }, [content.theme]);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      const keepAdminDraft = isAdminRoute() && Boolean(localStorage.getItem(CONTENT_STORAGE_KEY));
      if (keepAdminDraft) {
        setContent(loadSiteContent());
        return;
      }
      void fetchPublishedContent().then((published) => {
        if (!cancelled) setContent(published);
      });
    };
    const loadPublished = () => {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(start, { timeout: 2500 });
        return;
      }
      start();
    };
    if (isAdminRoute()) {
      start();
    } else if (document.readyState === 'complete') {
      loadPublished();
    } else {
      window.addEventListener('load', loadPublished, { once: true });
    }
    return () => {
      cancelled = true;
      window.removeEventListener('load', loadPublished);
    };
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      saveContent: (next) => {
        saveSiteContent(next);
        setContent(next);
      },
      resetContent: () => {
        clearStoredSiteContent();
        void clearPhotos();
        setContent(defaultSiteContent());
        void fetchPublishedContent().then(setContent);
      },
    }),
    [content]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
