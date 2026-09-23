import { describe, expect, it } from 'vitest';
import { applyMenuContent, defaultSiteContent, forPublicPublish, parseStoredContent } from '../content/store';
import { collectPrivateImageIds, collectUsedPhotoGitPaths, replacePrivateImageSrcs, sanitizePhotoName, unusedPhotoGitPaths } from '../content/privateImages';
import { MENU_ITEMS } from '../utils/constants';
import { normalizeImageSrc } from '../utils/images';

describe('forPublicPublish', () => {
  it('strips device-only image keys before a Git commit', () => {
    const base = defaultSiteContent();
    const published = forPublicPublish({
      ...base,
      images: { hero: 'idb:hero', aboutMain: 'https://images.unsplash.com/photo-x' },
      menu: base.menu.map((row, index) => (index === 0 ? { ...row, imageSrc: 'idb:menu-1' } : row)),
    });
    expect(published.images.hero).toBeUndefined();
    expect(published.images.aboutMain).toContain('https://');
    expect(published.menu[0].imageSrc).not.toMatch(/^idb:/);
  });

  it('rewrites device photos to src/assets/photos paths before guests see them', () => {
    const base = defaultSiteContent();
    const draft = {
      ...base,
      images: { hero: 'idb:hero' },
      menu: base.menu.map((row, index) => (index === 0 ? { ...row, imageSrc: 'idb:menu-c1' } : row)),
    };
    expect(collectPrivateImageIds(draft)).toEqual(['hero', 'menu-c1']);
    expect(sanitizePhotoName('menu-c1')).toBe('menu-c1');
    const live = replacePrivateImageSrcs(draft, {
      hero: '/assets/photos/hero.webp',
      'menu-c1': '/assets/photos/menu-c1.webp',
    });
    expect(live.images.hero).toBe('/assets/photos/hero.webp');
    expect(live.menu[0].imageSrc).toBe('/assets/photos/menu-c1.webp');
    expect(forPublicPublish(live).images.hero).toBe('/assets/photos/hero.webp');
  });

  it('lists unused src/assets/photos files for garbage collection', () => {
    const used = collectUsedPhotoGitPaths({
      images: { hero: '/assets/photos/hero.webp?v=9' },
      gallery: [{ imageSrc: '/photos/gallery-g1.webp' }],
    });
    expect(used).toEqual(['src/assets/photos/hero.webp', 'src/assets/photos/gallery-g1.webp']);
    expect(
      unusedPhotoGitPaths(
        ['src/assets/photos/.gitkeep', 'src/assets/photos/hero.webp', 'src/assets/photos/old.webp'],
        used
      )
    ).toEqual(['src/assets/photos/old.webp']);
  });
});

describe('admin lists and asset paths', () => {
  it('maps src/assets paths to /assets for public files', () => {
    expect(normalizeImageSrc('src/assets/nokti.webp')).toBe('/assets/nokti.webp');
    expect(normalizeImageSrc('assets/nokti.webp')).toBe('/assets/nokti.webp');
    expect(normalizeImageSrc('src/assets/webmap.png')).toBe('/assets/webmap.png');
    expect(normalizeImageSrc('gallery-g1.webp')).toBe('/assets/photos/gallery-g1.webp');
    expect(normalizeImageSrc('/gallery-g1.webp')).toBe('/assets/photos/gallery-g1.webp');
    expect(normalizeImageSrc('/photos/gallery-g1.webp')).toBe('/assets/photos/gallery-g1.webp');
    expect(normalizeImageSrc('/assets/gallery-g1.webp')).toBe('/assets/photos/gallery-g1.webp');
    expect(normalizeImageSrc('src/assets/photos/gallery-g1.webp')).toBe('/assets/photos/gallery-g1.webp');
  });

  it('keeps extra menu items added in admin', () => {
    const base = defaultSiteContent();
    const stored = parseStoredContent(
      JSON.stringify({
        ...base,
        menu: [
          ...base.menu,
          {
            id: 'custom-1',
            name: 'Domaca limunada',
            price: '280 RSD',
            description: 'Sveze',
            imageSrc: '/assets/limunada.webp',
            category: 'care',
          },
        ],
      })
    );
    const items = applyMenuContent(MENU_ITEMS, stored);
    expect(items.some((item) => item.id === 'custom-1')).toBe(true);
    expect(items.find((item) => item.id === 'custom-1')?.image.src).toBe('/assets/limunada.webp');
  });

  it('does not keep the old Freedom Instagram on the public site', () => {
    const stored = parseStoredContent(
      JSON.stringify({
        ...defaultSiteContent(),
        name: 'Freedom Boho Lounge Cafe',
        instagramHandle: '@freedom.boholoungecafe',
        instagramUrl: 'https://www.instagram.com/freedom.boholoungecafe?igsh=abc',
      })
    );
    expect(stored.name).toBe('Nokti & Trepavice');
    expect(stored.instagramHandle).toBe('@nokti_trepavice_uzice');
    expect(stored.instagramUrl).toBe('https://www.instagram.com/nokti_trepavice_uzice/');
  });

  it('drops a stored cafe menu instead of mixing it with the studio', () => {
    const stored = parseStoredContent(
      JSON.stringify({
        name: 'Luna Lounge Cafe',
        menu: [
          { id: 'c1', name: 'Espresso', price: '180', description: 'Kafa', imageSrc: '', category: 'coffee' },
          { id: 'c2', name: 'Aperol spritz', price: '490', description: 'Koktel', imageSrc: '', category: 'cocktails' },
        ],
      })
    );
    expect(stored.name).toBe('Nokti & Trepavice');
    expect(stored.menu.map((row) => row.name)).toContain('French manicure');
    expect(stored.menu.some((row) => /espresso|spritz/i.test(row.name))).toBe(false);
    expect(stored.menu[0].category).toBe('nails');
  });
});
