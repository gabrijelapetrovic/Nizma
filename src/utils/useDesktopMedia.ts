import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 641px)';

export function useDesktopMedia() {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setMatches(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return matches;
}
