import { BUSINESS_INFO, EVENTS, GALLERY_IMAGES, MENU_ITEMS, TESTIMONIALS } from '../utils/constants';
import { formatHoursLabel } from '../utils/hours';
import { createImage, isSafeImageSrc, normalizeImageSrc, overlayImage } from '../utils/images';
import { type EventItem, type GalleryImage, type MenuItem, type Testimonial, type WorkingHours } from '../types';
import { cleanPlainText, hasInjectionPayload } from '../utils/security';
import { defaultSiteTheme, parseSiteTheme, type SiteTheme } from './theme';

export const CONTENT_STORAGE_KEY = 'venue-site-content';
const LEGACY_STORAGE_KEY = 'freedom-site-content';
const LEGACY_VENUE =
  /freedom|boho\s+lounge|luna\s+lounge|lounge\s+cafe|kafi[cć]|po[zž]ega|658895955|065\s*889\s*5955/i;
const LEGACY_MENU = /\b(latte|espresso|cortado|cappuccino|spritz|cocktail|koktel|kafa|pivo|shisha|nargila|aperol|mojito)\b/i;

export const DEFAULT_MAPS_URL = 'https://www.google.com/maps?q=U%C5%BEice,+Srbija';
export const DEFAULT_MAPS_EMBED = 'https://www.google.com/maps?q=U%C5%BEice,+Srbija&z=14&output=embed';

export type EditableMenuRow = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageSrc: string;
  category: MenuItem['category'];
};

export type EditableEventRow = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  badge?: string;
  imageSrc: string;
};

export type EditableGalleryRow = {
  id: string;
  title: string;
  imageSrc: string;
  category: GalleryImage['category'];
};

export type EditableReviewRow = {
  id: string;
  name: string;
  role: string;
  comment: string;
  imageSrc: string;
};

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  email: string;
  addressFull: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  mapsUrl: string;
  mapsEmbed: string;
  whatsapp: string;
  workingHours: WorkingHours[];
  images: Record<string, string>;
  menu: EditableMenuRow[];
  events: EditableEventRow[];
  gallery: EditableGalleryRow[];
  reviews: EditableReviewRow[];
  theme: SiteTheme;
};

export function defaultSiteContent(): SiteContent {
  return {
    name: BUSINESS_INFO.name,
    tagline: BUSINESS_INFO.tagline,
    description: BUSINESS_INFO.description,
    phone: BUSINESS_INFO.phone,
    phoneRaw: BUSINESS_INFO.phoneRaw,
    email: BUSINESS_INFO.email,
    addressFull: BUSINESS_INFO.address.full,
    instagramUrl: BUSINESS_INFO.instagram.url,
    instagramHandle: BUSINESS_INFO.instagram.handle,
    facebookUrl: BUSINESS_INFO.socials.find((s) => s.name === 'Facebook')?.url || 'https://facebook.com',
    mapsUrl: DEFAULT_MAPS_URL,
    mapsEmbed: DEFAULT_MAPS_EMBED,
    whatsapp: BUSINESS_INFO.phoneRaw.replace(/\D/g, ''),
    workingHours: BUSINESS_INFO.workingHours.map((row) => ({ ...row })),
    images: {},
    menu: MENU_ITEMS.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      imageSrc: item.image.src,
      category: item.category,
    })),
    events: EVENTS.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description,
      badge: event.badge,
      imageSrc: event.image.src,
    })),
    gallery: GALLERY_IMAGES.map((item) => ({
      id: item.id,
      title: item.title,
      imageSrc: item.image.src,
      category: item.category,
    })),
    reviews: TESTIMONIALS.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      comment: item.comment,
      imageSrc: item.avatar.src,
    })),
    theme: defaultSiteTheme(),
  };
}

function safeText(value: unknown, fallback: string, max = 400): string {
  if (typeof value !== 'string') return fallback;
  if (hasInjectionPayload(value)) return fallback;
  const cleaned = cleanPlainText(value).slice(0, max);
  return cleaned || fallback;
}

function safeSrc(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = normalizeImageSrc(value.trim());
  if (!trimmed) return '';
  if (!isSafeImageSrc(trimmed)) return fallback;
  return trimmed.slice(0, 2000);
}

const MENU_CATEGORY_MAP: Record<string, MenuItem['category']> = {
  nails: 'nails',
  lashes: 'lashes',
  care: 'care',
  sets: 'sets',
  coffee: 'nails',
  cocktails: 'lashes',
  refreshments: 'care',
  wines_beers: 'sets',
};
const GALLERY_CATEGORY_MAP: Record<string, GalleryImage['category']> = {
  studio: 'studio',
  nails: 'nails',
  lashes: 'lashes',
  details: 'details',
  enterijer: 'studio',
  pica: 'nails',
  terasa: 'lashes',
  dogadjaji: 'details',
};
const MAX_LIST = 80;

function uniqueId(raw: string, used: Set<string>, prefix: string, index: number): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  let id = cleaned || `${prefix}-${index + 1}`;
  let n = 2;
  while (used.has(id)) id = `${cleaned || prefix}-${n++}`;
  used.add(id);
  return id;
}

function parseMenuRows(parsed: Partial<SiteContent>, defaults: SiteContent): EditableMenuRow[] {
  if (!Array.isArray(parsed.menu)) return defaults.menu;
  const used = new Set<string>();
  return parsed.menu.slice(0, MAX_LIST).map((next, index) => {
    const fallback = defaults.menu[index] || defaults.menu[0];
    const category =
      typeof next.category === 'string' && next.category in MENU_CATEGORY_MAP
        ? MENU_CATEGORY_MAP[next.category]
        : fallback.category;
    return {
      id: uniqueId(typeof next.id === 'string' ? next.id : '', used, 'menu', index),
      name: safeText(next.name, fallback?.name || 'Nova stavka', 80),
      price: safeText(next.price, fallback?.price || '', 40),
      description: safeText(next.description, fallback?.description || '', 400),
      imageSrc: safeSrc(next.imageSrc, fallback?.imageSrc || ''),
      category,
    };
  });
}

function parseEventRows(parsed: Partial<SiteContent>, defaults: SiteContent): EditableEventRow[] {
  if (!Array.isArray(parsed.events)) return defaults.events;
  const used = new Set<string>();
  return parsed.events.slice(0, MAX_LIST).map((next, index) => {
    const fallback = defaults.events[index] || defaults.events[0];
    return {
      id: uniqueId(typeof next.id === 'string' ? next.id : '', used, 'event', index),
      title: safeText(next.title, fallback?.title || 'Nova ponuda', 120),
      date: safeText(next.date, fallback?.date || '', 80),
      time: safeText(next.time, fallback?.time || '', 40),
      description: safeText(next.description, fallback?.description || '', 500),
      badge: next.badge ? safeText(next.badge, fallback?.badge || '', 40) : fallback?.badge,
      imageSrc: safeSrc(next.imageSrc, fallback?.imageSrc || ''),
    };
  });
}

function parseGalleryRows(parsed: Partial<SiteContent>, defaults: SiteContent): EditableGalleryRow[] {
  if (!Array.isArray(parsed.gallery)) return defaults.gallery;
  const used = new Set<string>();
  return parsed.gallery.slice(0, MAX_LIST).map((next, index) => {
    const fallback = defaults.gallery[index] || defaults.gallery[0];
    const category =
      typeof next.category === 'string' && next.category in GALLERY_CATEGORY_MAP
        ? GALLERY_CATEGORY_MAP[next.category]
        : fallback.category;
    return {
      id: uniqueId(typeof next.id === 'string' ? next.id : '', used, 'gallery', index),
      title: safeText(next.title, fallback?.title || 'Nova slika', 120),
      imageSrc: safeSrc(next.imageSrc, fallback?.imageSrc || ''),
      category,
    };
  });
}

function parseReviewRows(parsed: Partial<SiteContent>, defaults: SiteContent): EditableReviewRow[] {
  if (!Array.isArray(parsed.reviews)) return defaults.reviews;
  const used = new Set<string>();
  return parsed.reviews.slice(0, MAX_LIST).map((next, index) => {
    const fallback = defaults.reviews[index] || defaults.reviews[0];
    return {
      id: uniqueId(typeof next.id === 'string' ? next.id : '', used, 'review', index),
      name: safeText(next.name, fallback?.name || 'Gost', 80),
      role: safeText(next.role, fallback?.role || '', 80),
      comment: safeText(next.comment, fallback?.comment || '', 500),
      imageSrc: safeSrc(next.imageSrc, fallback?.imageSrc || ''),
    };
  });
}

export function parseStoredContent(raw: string | null): SiteContent {
  const defaults = defaultSiteContent();
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    const hours = Array.isArray(parsed.workingHours)
      ? defaults.workingHours.map((row, index) => {
          const next = parsed.workingHours?.[index];
          if (!next) return row;
          const openTime = safeText(next.openTime, row.openTime, 5);
          const closeTime = safeText(next.closeTime, row.closeTime, 5);
          return {
            ...row,
            openTime,
            closeTime,
            hours: formatHoursLabel(openTime, closeTime),
          };
        })
      : defaults.workingHours;

    const menu = parseMenuRows(parsed, defaults);
    const events = parseEventRows(parsed, defaults);
    const gallery = parseGalleryRows(parsed, defaults);
    const reviews = parseReviewRows(parsed, defaults);

    const images: Record<string, string> = {};
    if (parsed.images && typeof parsed.images === 'object') {
      for (const [key, src] of Object.entries(parsed.images)) {
        if (/^[a-z0-9_-]+$/i.test(key)) images[key] = safeSrc(src, '');
      }
    }
    if (!images.aboutNails && images.aboutCoffee) images.aboutNails = images.aboutCoffee;
    delete images.aboutCoffee;

    const next = {
      name: safeText(parsed.name, defaults.name, 80),
      tagline: safeText(parsed.tagline, defaults.tagline, 200),
      description: safeText(parsed.description, defaults.description, 500),
      phone: safeText(parsed.phone, defaults.phone, 30),
      phoneRaw: safeText(parsed.phoneRaw, defaults.phoneRaw, 20),
      email: safeText(parsed.email, defaults.email, 80),
      addressFull: safeText(parsed.addressFull, defaults.addressFull, 120),
      instagramUrl: safeSrc(parsed.instagramUrl, defaults.instagramUrl),
      instagramHandle: safeText(parsed.instagramHandle, defaults.instagramHandle, 40),
      facebookUrl: safeSrc(parsed.facebookUrl, defaults.facebookUrl),
      mapsUrl: safeSrc(parsed.mapsUrl, defaults.mapsUrl),
      mapsEmbed: safeSrc(parsed.mapsEmbed, defaults.mapsEmbed),
      whatsapp: safeText(parsed.whatsapp, defaults.whatsapp, 20).replace(/\D/g, ''),
      workingHours: hours,
      images,
      menu,
      events,
      gallery,
      reviews,
      theme: parseSiteTheme(parsed.theme, defaults.theme),
    };
    return isLegacyVenue(next) ? defaults : next;
  } catch {
    return defaults;
  }
}

function isLegacyVenue(content: SiteContent): boolean {
  const identity = `${content.name} ${content.tagline} ${content.description} ${content.instagramHandle} ${content.instagramUrl} ${content.addressFull} ${content.phone} ${content.phoneRaw}`;
  if (LEGACY_VENUE.test(identity)) return true;
  const drinks = content.menu.filter((row) => LEGACY_MENU.test(`${row.name} ${row.description}`)).length;
  return drinks >= 2;
}

export function clearStoredSiteContent() {
  try {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function loadSiteContent(): SiteContent {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return parseStoredContent(localStorage.getItem(CONTENT_STORAGE_KEY));
  } catch {
    return defaultSiteContent();
  }
}

export function saveSiteContent(content: SiteContent) {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
}

export async function fetchPublishedContent(): Promise<SiteContent> {
  try {
    const response = await fetch('/site-content.json', { cache: 'no-store' });
    if (!response.ok) return defaultSiteContent();
    return parseStoredContent(await response.text());
  } catch {
    return defaultSiteContent();
  }
}

function withoutPrivateSrc(src: string, fallback: string): string {
  if (src.startsWith('idb:') || src.startsWith('blob:')) return fallback;
  return src;
}

/** Drop device-only photos so a Git commit is safe for every visitor. */
export function forPublicPublish(content: SiteContent): SiteContent {
  const parsed = parseStoredContent(JSON.stringify(content));
  const defaults = defaultSiteContent();
  return {
    ...parsed,
    images: Object.fromEntries(
      Object.entries(parsed.images).filter(
        ([, src]) => src && !src.startsWith('idb:') && !src.startsWith('blob:')
      )
    ),
    menu: parsed.menu.map((row, index) => ({
      ...row,
      imageSrc: withoutPrivateSrc(row.imageSrc, defaults.menu[index]?.imageSrc || ''),
    })),
    events: parsed.events.map((row, index) => ({
      ...row,
      imageSrc: withoutPrivateSrc(row.imageSrc, defaults.events[index]?.imageSrc || ''),
    })),
    gallery: parsed.gallery.map((row, index) => ({
      ...row,
      imageSrc: withoutPrivateSrc(row.imageSrc, defaults.gallery[index]?.imageSrc || ''),
    })),
    reviews: parsed.reviews.map((row, index) => ({
      ...row,
      imageSrc: withoutPrivateSrc(row.imageSrc, defaults.reviews[index]?.imageSrc || ''),
    })),
  };
}

function fallbackAsset(src: string, alt: string): ReturnType<typeof createImage> {
  return createImage(src || '/favicon.svg', alt, 800, 500);
}

export function applyMenuContent(items: MenuItem[], content: SiteContent): MenuItem[] {
  return content.menu.map((row) => {
    const base = items.find((item) => item.id === row.id);
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      image: overlayImage(base?.image || fallbackAsset(row.imageSrc, row.name), row.imageSrc),
      popular: base?.popular,
      tags: base?.tags,
      volume: base?.volume,
    };
  });
}

export function applyEventContent(items: EventItem[], content: SiteContent): EventItem[] {
  return content.events.map((row) => {
    const base = items.find((item) => item.id === row.id);
    return {
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      category: base?.category || '',
      description: row.description,
      image: overlayImage(base?.image || fallbackAsset(row.imageSrc, row.title), row.imageSrc),
      badge: row.badge,
    };
  });
}

export function applyGalleryContent(items: GalleryImage[], content: SiteContent): GalleryImage[] {
  return content.gallery.map((row) => {
    const base = items.find((item) => item.id === row.id);
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      image: overlayImage(base?.image || fallbackAsset(row.imageSrc, row.title), row.imageSrc),
      aspect: base?.aspect,
    };
  });
}

export function applyReviewContent(items: Testimonial[], content: SiteContent): Testimonial[] {
  return content.reviews.map((row) => {
    const base = items.find((item) => item.id === row.id);
    return {
      id: row.id,
      name: row.name,
      role: row.role,
      rating: base?.rating ?? 5,
      comment: row.comment,
      date: base?.date || '',
      avatar: overlayImage(base?.avatar || fallbackAsset(row.imageSrc, row.name), row.imageSrc),
    };
  });
}

/** 069 159 6686 / +381691596686 → 381691596686 for wa.me and Viber. */
export function toInternationalChatDigits(phone: string, fallback = '381691596686'): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('381')) return digits;
  if (digits.startsWith('0')) return `381${digits.slice(1)}`;
  return digits.length >= 8 ? digits : fallback;
}

export function whatsappLink(digits: string, text: string) {
  return `https://wa.me/${toInternationalChatDigits(digits)}?text=${encodeURIComponent(text)}`;
}

export function viberLink(digits: string) {
  return `viber://chat?number=%2B${toInternationalChatDigits(digits)}`;
}
