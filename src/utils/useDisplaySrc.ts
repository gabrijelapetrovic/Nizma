import { useEffect, useState } from 'react';
import { getPhoto } from '../content/imageStore';
import { normalizeImageSrc } from './images';

export function useDisplaySrc(src: string): string {
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (!src.startsWith('idb:')) {
      return undefined;
    }
    const id = src.slice(4);
    let objectUrl = '';
    let cancelled = false;
    getPhoto(id)
      .then((blob) => {
        if (cancelled || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (src.startsWith('idb:')) return blobUrl;
  return normalizeImageSrc(src);
}
