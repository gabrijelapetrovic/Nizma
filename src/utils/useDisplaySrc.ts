import { normalizeImageSrc } from './images';

/** Public image URL. Device-only drafts are not shown. */
export function useDisplaySrc(src: string): string {
  if (src.startsWith('idb:') || src.startsWith('blob:')) return '';
  return normalizeImageSrc(src);
}
