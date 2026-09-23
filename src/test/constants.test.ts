import { describe, it, expect } from 'vitest';
import {
  BUSINESS_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  EVENTS,
  GALLERY_IMAGES,
  TESTIMONIALS,
  FAQS,
  VIBE_HIGHLIGHTS,
} from '../utils/constants';
import { toInternationalChatDigits, viberLink, whatsappLink } from '../content/store';

describe('Constants & Data Integrity', () => {
  it('should have valid dummy venue information', () => {
    expect(BUSINESS_INFO.name).toBe('Nokti & Trepavice');
    expect(BUSINESS_INFO.shortName).toBe('Nokti');
    expect(BUSINESS_INFO.address.city).toBe('Užice');
    expect(BUSINESS_INFO.phone).toBe('069 159 6686');
    expect(BUSINESS_INFO.phoneRaw).toBe('+381691596686');
    expect(BUSINESS_INFO.instagram.url).toContain('nokti_trepavice_uzice');
    expect(BUSINESS_INFO.workingHours.map((row) => row.id)).toEqual(['monFri', 'sat']);
  });

  it('should have defined service categories for nails, lashes, care and sets', () => {
    expect(MENU_CATEGORIES.length).toBeGreaterThan(3);
    const categoryIds = MENU_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain('all');
    expect(categoryIds).toContain('nails');
    expect(categoryIds).toContain('lashes');
    expect(categoryIds).toContain('care');
    expect(categoryIds).toContain('sets');
  });

  it('should have properly structured services with valid categories and prices', () => {
    expect(MENU_ITEMS.length).toBeGreaterThan(5);
    MENU_ITEMS.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.price).toContain('RSD');
      expect(item.image.src).toBeTruthy();
      expect(item.image.alt).toBeTruthy();
      expect(item.image.width).toBeGreaterThan(0);
      expect(item.image.height).toBeGreaterThan(0);
      expect(item.description).toBeTruthy();
    });
  });

  it('should have upcoming events without unavailable offerings', () => {
    expect(EVENTS.length).toBeGreaterThan(0);
    expect(EVENTS.every((e) => e.category !== 'Nedostupna ponuda')).toBe(true);
    EVENTS.forEach((e) => {
      expect(e.id).toBeTruthy();
      expect(e.date).toBeTruthy();
      expect(e.time).toBeTruthy();
    });
  });

  it('should have gallery images with categorized tags', () => {
    expect(GALLERY_IMAGES.length).toBeGreaterThan(4);
    GALLERY_IMAGES.forEach((img) => {
      expect(img.id).toBeTruthy();
      expect(img.image.src).toBeTruthy();
      expect(img.image.alt).toBeTruthy();
      expect(img.category).toBeTruthy();
    });
  });

  it('starts without invented guest reviews', () => {
    expect(TESTIMONIALS).toEqual([]);
  });

  it('should have FAQ items with questions and answers', () => {
    expect(FAQS.length).toBeGreaterThan(2);
    FAQS.forEach((f) => {
      expect(f.question).toBeTruthy();
      expect(f.answer).toBeTruthy();
    });
  });

  it('should have 3 vibe highlights for nails, lashes and the studio rhythm', () => {
    expect(VIBE_HIGHLIGHTS.length).toBe(3);
  });

  it('uses photo ids that still resolve on Unsplash', () => {
    const retired = ['1519014816548-bf5fe059798e', '1596704017254-9b121068ec31'];
    const srcs = [
      ...MENU_ITEMS.map((item) => item.image.src),
      ...GALLERY_IMAGES.map((item) => item.image.src),
      ...EVENTS.map((item) => item.image.src),
      ...VIBE_HIGHLIGHTS.map((item) => item.image.src),
    ];
    for (const src of srcs) {
      expect(retired.some((id) => src.includes(id))).toBe(false);
      expect(src).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
    }
  });
});

describe('WhatsApp / Viber phone', () => {
  it('maps 060 1234567 to the international chat number', () => {
    expect(toInternationalChatDigits('060 1234567')).toBe('381601234567');
    expect(toInternationalChatDigits('+381601234567')).toBe('381601234567');
    expect(whatsappLink('060 1234567', 'zdravo')).toContain('https://wa.me/381601234567');
    expect(viberLink('060 1234567')).toBe('viber://chat?number=%2B381601234567');
  });
});
