import { type ImageAsset } from '../types';
import { IMAGE_SIZES, buildSrcSet, isSanitySrc, isUnsplashSrc, resolveSrc } from '../utils/images';
import { useDisplaySrc } from '../utils/useDisplaySrc';

type ImageProps = {
  image: ImageAsset;
  className?: string;
  sizes?: string;
  /** LCP / above-the-fold: eager + fetchPriority high (Hero only). */
  priority?: boolean;
  widths?: number[];
  quality?: number;
};

/**
 * Responsive image from an ImageAsset object (constants).
 * Unsplash URLs get real WebP variants; local `src/assets/*.webp` are used as-is
 * (add `srcSet` on the object when 400/800/1200 files exist).
 */
export function Image({
  image,
  className,
  sizes = IMAGE_SIZES.third,
  priority = false,
  widths = [400, 800],
  quality = 70,
}: ImageProps) {
  const { src, alt, width, height } = image;
  const displaySrc = useDisplaySrc(src);
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'low';
  const srcSet = src.startsWith('idb:') || src.startsWith('blob:') ? undefined : buildSrcSet(image, widths, quality);
  const resolvedSrc = displaySrc ? resolveSrc(displaySrc, width, quality) : '';

  if (!resolvedSrc) return null;

  if (priority && (isUnsplashSrc(src) || isSanitySrc(src)) && !image.srcSet) {
    const lcpSrc = resolveSrc(resolvedSrc, 1100, Math.min(quality, 50));
    return (
      <img
        src={lcpSrc}
        width={width}
        height={height}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
      />
    );
  }

  return (
    <img
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
