import { readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createClient, type SanityClient } from '@sanity/client';

type ThemeColors = {
  bg: string;
  sand: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  gold: string;
  dark: string;
  sage: string;
};

type SiteFile = {
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
  workingHours: {
    id: string;
    days: string;
    hours: string;
    weekdays: number[];
    openTime: string;
    closeTime: string;
  }[];
  images: Record<string, string>;
  menu: { id: string; name: string; price: string; description: string; category: string; imageSrc: string }[];
  events: { id: string; title: string; date: string; time: string; description: string; badge?: string; imageSrc: string }[];
  gallery: { id: string; title: string; category: string; imageSrc: string }[];
  reviews: { id: string; name: string; role: string; comment: string; imageSrc: string }[];
  theme: { preset: string; colors: ThemeColors };
};

type ImageField = {
  imageUrl: string;
  image?: {
    _type: 'image';
    asset: { _type: 'reference'; _ref: string };
  };
};

const dryRun = !process.argv.includes('--write');

function log(message: string) {
  console.log(`[migrate] ${message}`);
}

function fail(message: string): never {
  console.error(`[migrate] ${message}`);
  process.exit(1);
}

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
    /* file is optional */
  }
}

function filenameFrom(url: string, fallback: string): string {
  try {
    const name = basename(new URL(url).pathname);
    if (name && name.includes('.')) return name;
  } catch {
    /* relative path */
  }
  const local = basename(url.split('?')[0] || '');
  return local || `${fallback}.jpg`;
}

async function uploadUrl(
  client: SanityClient,
  url: string,
  cache: Map<string, string>,
  label: string,
): Promise<ImageField> {
  if (!url) return { imageUrl: '' };
  if (dryRun) {
    log(`dry-run asset ${label}: ${url}`);
    return { imageUrl: url };
  }
  const cached = cache.get(url);
  if (cached) {
    return { imageUrl: url, image: { _type: 'image', asset: { _type: 'reference', _ref: cached } } };
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const asset = await client.assets.upload('image', bytes, { filename: filenameFrom(url, label) });
  cache.set(url, asset._id);
  log(`uploaded ${label} → ${asset._id}`);
  return { imageUrl: url, image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } };
}

async function imageField(
  client: SanityClient | null,
  url: string,
  cache: Map<string, string>,
  label: string,
): Promise<ImageField> {
  try {
    if (!client || dryRun) return uploadUrl(client as SanityClient, url, cache, label);
    return await uploadUrl(client, url, cache, label);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`asset skipped (${label}): ${message}. Keeping URL.`);
    return { imageUrl: url };
  }
}

async function main() {
  loadDotEnv(join(process.cwd(), '.env'));
  loadDotEnv(join(process.cwd(), '.env.local'));

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim() || '';

  const raw = readFileSync(join(process.cwd(), 'public', 'site-content.json'), 'utf8');
  const content = JSON.parse(raw) as SiteFile;
  log(`${dryRun ? 'DRY RUN' : 'WRITE'} — ${content.menu.length} usluga, ${content.gallery.length} galerija, ${content.events.length} ponuda, ${content.reviews.length} utisaka`);

  let client: SanityClient | null = null;
  if (!dryRun) {
    if (!projectId) fail('Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Create the Sanity project first.');
    if (!token) fail('Missing SANITY_API_WRITE_TOKEN. Dry-run does not need it; --write does.');
    client = createClient({
      projectId,
      dataset,
      apiVersion: '2026-10-14',
      token,
      useCdn: false,
    });
  } else if (!projectId) {
    log('No project id yet. Mapping local JSON only; nothing is sent.');
  }

  const cache = new Map<string, string>();
  const uploader = client ?? createClient({ projectId: projectId || 'placeholder', dataset, apiVersion: '2026-10-14', useCdn: false });

  const images = [];
  for (const [key, src] of Object.entries(content.images)) {
    const field = await imageField(dryRun ? null : uploader, src, cache, key);
    images.push({ _key: key, _type: 'namedImage', key, ...field });
  }

  const menu = [];
  for (const row of content.menu) {
    const field = await imageField(dryRun ? null : uploader, row.imageSrc, cache, row.id);
    menu.push({
      _key: row.id,
      _type: 'menuItem',
      id: row.id,
      name: row.name,
      price: row.price,
      description: row.description,
      category: row.category,
      ...field,
    });
  }

  const events = [];
  for (const row of content.events) {
    const field = await imageField(dryRun ? null : uploader, row.imageSrc, cache, row.id);
    events.push({
      _key: row.id,
      _type: 'eventItem',
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      description: row.description,
      badge: row.badge,
      ...field,
    });
  }

  const gallery = [];
  for (const row of content.gallery) {
    const field = await imageField(dryRun ? null : uploader, row.imageSrc, cache, row.id);
    gallery.push({
      _key: row.id,
      _type: 'galleryItem',
      id: row.id,
      title: row.title,
      category: row.category,
      ...field,
    });
  }

  const reviews = [];
  for (const row of content.reviews) {
    const field = await imageField(dryRun ? null : uploader, row.imageSrc, cache, row.id);
    reviews.push({
      _key: row.id,
      _type: 'reviewItem',
      id: row.id,
      name: row.name,
      role: row.role,
      comment: row.comment,
      ...field,
    });
  }

  const document = {
    _id: 'site',
    _type: 'site',
    name: content.name,
    tagline: content.tagline,
    description: content.description,
    phone: content.phone,
    phoneRaw: content.phoneRaw,
    email: content.email,
    addressFull: content.addressFull,
    instagramUrl: content.instagramUrl,
    instagramHandle: content.instagramHandle,
    facebookUrl: content.facebookUrl,
    mapsUrl: content.mapsUrl,
    mapsEmbed: content.mapsEmbed,
    whatsapp: content.whatsapp,
    workingHours: content.workingHours.map((row) => ({ _key: row.id, _type: 'workingHoursRow', ...row })),
    images,
    menu,
    events,
    gallery,
    reviews,
    theme: content.theme,
  };

  log(`document _id=site _type=site preset=${content.theme.preset} accent=${content.theme.colors.accent}`);

  if (dryRun) {
    log('Dry run finished. Re-run with --write after the Sanity project and write token exist.');
    return;
  }

  try {
    await uploader.createOrReplace(document);
    log('Wrote document site.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`createOrReplace failed: ${message}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
