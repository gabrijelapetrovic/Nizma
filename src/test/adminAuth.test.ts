import { describe, expect, it, beforeEach } from 'vitest';
import {
  FALLBACK_PIN_HASH,
  isLockedOut,
  isSafeAdminPin,
  recordFailedPin,
  sha256Hex,
  verifyAdminPin,
} from '../utils/adminAuth';
import { isSafeImageSrc } from '../utils/images';

describe('admin PIN hashing', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('hashes freedom to the shipped fallback', async () => {
    expect(await sha256Hex('freedom')).toBe(FALLBACK_PIN_HASH);
  });

  it('accepts the default PIN and rejects a wrong one', async () => {
    expect(await verifyAdminPin('freedom')).toBe(true);
    expect(await verifyAdminPin('nope')).toBe(false);
  });

  it('rejects XSS payloads instead of hashing them', async () => {
    expect(isSafeAdminPin('<script>alert(1)</script>')).toBe(false);
    expect(isSafeAdminPin('javascript:alert(1)')).toBe(false);
    expect(isSafeAdminPin('freedom')).toBe(true);
    expect(await verifyAdminPin('<img src=x onerror=alert(1)>')).toBe(false);
  });

  it('locks out after repeated failures', () => {
    for (let i = 0; i < 5; i++) recordFailedPin();
    expect(isLockedOut()).toBe(true);
  });
});

describe('image URL allowlist', () => {
  it('allows https, site paths and idb keys only', () => {
    expect(isSafeImageSrc('https://images.unsplash.com/photo-1')).toBe(true);
    expect(isSafeImageSrc('/photos/hero.webp')).toBe(true);
    expect(isSafeImageSrc('/assets/photos/hero.webp')).toBe(true);
    expect(isSafeImageSrc('/assets/nokti.webp')).toBe(true);
    expect(isSafeImageSrc('src/assets/nokti.webp')).toBe(true);
    expect(isSafeImageSrc('assets/nokti.webp')).toBe(true);
    expect(isSafeImageSrc('idb:hero')).toBe(true);
    expect(isSafeImageSrc('gallery-g1.webp')).toBe(true);
    expect(isSafeImageSrc('javascript:alert(1)')).toBe(false);
    expect(isSafeImageSrc('http://insecure.example/x.jpg')).toBe(false);
  });
});
