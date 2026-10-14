'use client';

import { useEffect } from 'react';
import { isProdBuild } from '../utils/publicEnv';

function addHeadLink(rel: string, href: string, extra?: Partial<HTMLLinkElement>) {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (extra) Object.assign(link, extra);
  document.head.appendChild(link);
}

/** Same font and service-worker timing the Vite entry used. */
export function SiteBoot() {
  useEffect(() => {
    if (window.matchMedia('(min-width: 641px)').matches) {
      addHeadLink('preconnect', 'https://images.unsplash.com', { crossOrigin: 'anonymous' });
      const loadFonts = () => {
        addHeadLink('preconnect', 'https://fonts.googleapis.com');
        addHeadLink('preconnect', 'https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
        addHeadLink(
          'stylesheet',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap',
        );
      };
      if (document.readyState === 'complete') loadFonts();
      else window.addEventListener('load', loadFonts, { once: true });
    }

    if (isProdBuild() && 'serviceWorker' in navigator) {
      const onLoad = () => {
        const delay = window.matchMedia('(max-width: 640px)').matches ? 8000 : 4000;
        globalThis.setTimeout(() => {
          navigator.serviceWorker.register('/sw.js').catch(() => undefined);
        }, delay);
      };
      if (document.readyState === 'complete') onLoad();
      else window.addEventListener('load', onLoad, { once: true });
    }
  }, []);

  return null;
}
