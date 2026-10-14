import { type ImageAsset } from '../types';

/**
 * Layout-aware `sizes` so the browser does not download a full-viewport file
 * for a card that is only a third of the screen (PageSpeed LCP / image weight).
 */
export const IMAGE_SIZES = {
  full: '100vw',
  half: '(max-width: 1024px) 100vw, 50vw',
  third: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  event: '(max-width: 640px) 100vw, 42vw',
  about: '(max-width: 1024px) 100vw, 420px',
  aboutThumb: '176px',
  avatar: '44px',
  lightbox: '(max-width: 768px) 92vw, 896px',
} as const;

export function createImage(
  src: string,
  alt: string,
  width: number,
  height: number,
  srcSet?: Record<number, string>
): ImageAsset {
  return srcSet ? { src, alt, width, height, srcSet } : { src, alt, width, height };
}

export function unsplashPhoto(id: string, alt: string, width = 800, height = 500) {
  return createImage(`https://images.unsplash.com/photo-${id}`, alt, width, height);
}

export function isUnsplashSrc(src: string): boolean {
  return src.includes('images.unsplash.com');
}

export function isRemoteSrc(src: string): boolean {
  return /^(https?:)?\/\//.test(src);
}

function stripQuery(src: string): string {
  return src.split('?')[0];
}

export function isSanitySrc(src: string): boolean {
  return src.includes('cdn.sanity.io/images/');
}

/** Sanity CDN accepts width and format. Full originals are several thousand pixels. */
export function sanityImageUrl(src: string, width: number, quality: number): string {
  return `${stripQuery(src)}?auto=format&fit=max&w=${width}&q=${quality}`;
}

/** Tab icon. Raster files are cropped to 64px; SVG stays a vector. */
export function faviconHref(src: string): string {
  if (!isSanitySrc(src)) return src;
  if (stripQuery(src).toLowerCase().endsWith('.svg')) return stripQuery(src);
  return `${stripQuery(src)}?auto=format&fit=crop&w=64&h=64&q=80`;
}
export function unsplashUrl(src: string, width: number, quality: number): string {
  return `${stripQuery(src)}?auto=format&fit=crop&fm=webp&w=${width}&q=${quality}`;
}

/**
 * Mentor / Vercel-style query optimizer. Use only when files are served
 * through a CDN that honors `w`, `format=auto`, `quality=auto`.
 */
export function cdnUrl(src: string, width: number): string {
  return `${stripQuery(src)}?w=${width}&format=auto&quality=auto`;
}

export function resolveSrc(src: string, width: number, quality: number): string {
  if (src.startsWith('idb:') || src.startsWith('blob:')) return src;
  if (isUnsplashSrc(src)) return unsplashUrl(src, width, quality);
  if (isSanitySrc(src)) return sanityImageUrl(src, width, quality);
  return src;
}

const CMS_PHOTO_FILE =
  /^(?:gallery|menu|event|review|hero|about(?:Main|Coffee)?)-[a-zA-Z0-9._-]*\.(?:webp|png|jpe?g|gif|avif)$/i;
const CMS_PHOTO_EXACT =
  /^(?:hero|aboutMain|aboutNails|aboutCoffee)\.(?:webp|png|jpe?g|gif|avif)$/i;

function toPhotosPath(fileWithQuery: string): string {
  const [file, query] = fileWithQuery.split('?');
  return query ? `/assets/photos/${file}?${query}` : `/assets/photos/${file}`;
}

export function normalizeImageSrc(value: string): string {
  let next = value.trim().replace(/\\/g, '/');
  if (!next) return next;
  while (next.startsWith('./')) next = next.slice(2);
  while (next.startsWith('../')) next = next.slice(3);
  if (next.startsWith('public/')) next = `/${next.slice('public/'.length)}`;
  if (next.startsWith('src/assets/')) next = `/assets/${next.slice('src/assets/'.length)}`;
  if (next.startsWith('/src/assets/')) next = `/assets/${next.slice('/src/assets/'.length)}`;

  const [pathname, query] = next.split('?');
  const suffix = query ? `?${query}` : '';
  const file = pathname.split('/').pop() || '';
  const isCmsPhoto = CMS_PHOTO_FILE.test(file) || CMS_PHOTO_EXACT.test(file);

  if (pathname.startsWith('/photos/') || pathname.startsWith('photos/')) {
    return toPhotosPath(file + suffix);
  }
  if (isCmsPhoto && !pathname.startsWith('/assets/photos/')) {
    return toPhotosPath(file + suffix);
  }
  if (next.startsWith('/assets/')) return next;
  if (next.startsWith('assets/')) return `/${next}`;
  if (/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(webp|png|jpe?g|gif|avif)$/i.test(pathname)) {
    return toPhotosPath(pathname + suffix);
  }
  return next;
}

export function isSafeImageSrc(value: string): boolean {
  if (!value || value.length > 2000) return false;
  const normalized = normalizeImageSrc(value);
  if (/^idb:[a-z0-9:_-]+$/i.test(normalized)) return true;
  if (normalized.startsWith('/') && !normalized.startsWith('//') && !normalized.includes('..')) return true;
  try {
    const url = new URL(normalized);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function overlayImage(image: ImageAsset, src?: string): ImageAsset {
  if (!src || !isSafeImageSrc(src)) return image;
  const normalized = normalizeImageSrc(src);
  if (normalized === image.src) return image;
  return { ...image, src: normalized, srcSet: undefined };
}

export function buildSrcSet(
  image: ImageAsset,
  widths: number[],
  quality: number
): string | undefined {
  if (image.srcSet) {
    return Object.entries(image.srcSet)
      .map(([w, url]) => `${url} ${w}w`)
      .join(', ');
  }

  if (!isRemoteSrc(image.src) || (!isUnsplashSrc(image.src) && !isSanitySrc(image.src))) return undefined;

  return widths.map((w) => `${resolveSrc(image.src, w, quality)} ${w}w`).join(', ');
}
