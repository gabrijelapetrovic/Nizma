import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@sanity/client';
import { MESSAGES } from '../src/i18n/translations.ts';

function loadDotEnv(file: string) {
  try {
    const text = readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* optional */
  }
}

const SECTION_IMAGES = [
  { key: 'hero', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371' },
  { key: 'aboutMain', imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53' },
  { key: 'aboutNails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371' },
  { key: 'vibe0', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371' },
  { key: 'vibe1', imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2' },
  { key: 'vibe2', imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc' },
];

loadDotEnv(join(process.cwd(), '.env.local'));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN?.trim() || '';
if (!projectId || !token) {
  console.error('[cms] Missing project id or write token');
  process.exit(1);
}

const copy = Object.keys(MESSAGES.sr).map((key) => ({
  _key: key.replace(/[^a-zA-Z0-9]/g, '_'),
  _type: 'copyLine',
  key,
  sr: MESSAGES.sr[key] ?? '',
  en: MESSAGES.en[key] ?? '',
}));

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-14',
  token,
  useCdn: false,
});

const doc = await client.getDocument('site');
const images = Array.isArray(doc?.images) ? [...doc.images] : [];
const have = new Set(images.map((row) => (row && typeof row === 'object' && 'key' in row ? String(row.key) : '')));
for (const extra of SECTION_IMAGES) {
  if (have.has(extra.key)) continue;
  images.push({ _key: extra.key, _type: 'namedImage', key: extra.key, imageUrl: extra.imageUrl });
}

await client.patch('site').set({ copy, images }).commit();
console.log(`[cms] Saved ${copy.length} text rows and ${images.length} image slots.`);
