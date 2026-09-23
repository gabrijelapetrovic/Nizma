import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Image } from '../components/Image';
import { createImage, unsplashUrl } from '../utils/images';

describe('Optimized Image', () => {
  it('builds Unsplash webp srcset from an ImageAsset object', () => {
    const image = createImage(
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      'Enterijer',
      800,
      500
    );
    const { container } = render(<Image image={image} sizes="33vw" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'Enterijer');
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '500');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img?.getAttribute('src')).toContain('fm=webp');
    expect(img?.getAttribute('srcset')).toContain('400w');
    expect(img?.getAttribute('srcset')).toContain('800w');
    expect(img?.getAttribute('sizes')).toBe('33vw');
  });

  it('does not invent CDN query params for local WebP assets', () => {
    const image = createImage('/assets/menu/pistachio.webp', 'Pistachio latte', 800, 500);
    const { container } = render(<Image image={image} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/assets/menu/pistachio.webp');
    expect(img?.getAttribute('srcset')).toBeNull();
  });

  it('uses provided local srcSet variants when present', () => {
    const image = createImage('/assets/hero.webp', 'Hero', 1600, 900, {
      400: '/assets/hero-400.webp',
      800: '/assets/hero-800.webp',
      1200: '/assets/hero-1200.webp',
    });
    const { container } = render(<Image image={image} priority sizes="100vw" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('srcset')).toContain('hero-400.webp 400w');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('matches Unsplash helper output used by desktop hero LCP', () => {
    const src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24';
    expect(unsplashUrl(src, 1100, 50)).toBe(
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&fm=webp&w=1100&q=50'
    );
  });

  it('uses a single Unsplash LCP file instead of picture + srcset', () => {
    const image = createImage(
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      'Hero',
      1600,
      900
    );
    const { container } = render(<Image image={image} priority quality={50} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toContain('w=1100');
    expect(img?.getAttribute('src')).toContain('q=50');
    expect(img?.getAttribute('srcset')).toBeNull();
    expect(container.querySelector('picture')).toBeNull();
  });
});
