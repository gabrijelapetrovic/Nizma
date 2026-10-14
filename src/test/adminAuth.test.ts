import { describe, expect, it } from 'vitest';
import { isSafeImageSrc } from '../utils/images';

describe('image URL allowlist', () => {
  it('allows https and site paths only', () => {
    expect(isSafeImageSrc('https://images.unsplash.com/photo-1')).toBe(true);
    expect(isSafeImageSrc('/photos/hero.webp')).toBe(true);
    expect(isSafeImageSrc('/assets/photos/hero.webp')).toBe(true);
    expect(isSafeImageSrc('/assets/nokti.webp')).toBe(true);
    expect(isSafeImageSrc('src/assets/nokti.webp')).toBe(true);
    expect(isSafeImageSrc('assets/nokti.webp')).toBe(true);
    expect(isSafeImageSrc('gallery-g1.webp')).toBe(true);
    expect(isSafeImageSrc('javascript:alert(1)')).toBe(false);
    expect(isSafeImageSrc('http://insecure.example/x.jpg')).toBe(false);
  });
});
