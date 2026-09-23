/**
 * Responsive image object used across the site.
 * Today `src` is an Unsplash URL; later replace with a Vite import from `src/assets/*.webp`.
 * Optional `srcSet` maps CSS widths to extra local files (e.g. 400 / 800 / 1200).
 */
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet?: Record<number, string>;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'nails' | 'lashes' | 'care' | 'sets';
  image: ImageAsset;
  popular?: boolean;
  tags?: string[];
  volume?: string;
}

export interface MenuCategory {
  id: 'all' | 'nails' | 'lashes' | 'care' | 'sets';
  name: string;
  iconName: string;
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  image: ImageAsset;
  badge?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'studio' | 'nails' | 'lashes' | 'details';
  image: ImageAsset;
  aspect?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  avatar: ImageAsset;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface BusinessInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    city: string;
    country: string;
    full: string;
  };
  phone: string;
  phoneRaw: string;
  email: string;
  instagram: {
    handle: string;
    url: string;
  };
  socials: {
    name: string;
    url: string;
    icon: string;
  }[];
  workingHours: WorkingHours[];
}

export interface WorkingHours {
  id: string;
  days: string;
  hours: string;
  weekdays: number[];
  openTime: string;
  closeTime: string;
}

export interface ReservationFormData {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'nails' | 'lashes' | 'both' | 'any';
  specialRequests?: string;
}
