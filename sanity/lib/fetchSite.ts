import { parseStoredContent, type SiteContent } from '../../src/content/store';
import { getSanityClient } from './client';
import { siteQuery } from './queries';

type NamedImage = { key?: string; src?: string };

type SanitySite = Omit<SiteContent, 'images'> & {
  images?: NamedImage[] | SiteContent['images'];
};

function imagesRecord(images: SanitySite['images']): Record<string, string> {
  if (!images) return {};
  if (!Array.isArray(images)) return images;
  const record: Record<string, string> = {};
  for (const row of images) {
    if (row.key && row.src) record[row.key] = row.src;
  }
  return record;
}

/** GROQ document → the same SiteContent shape the page already renders. */
export function siteContentFromSanity(raw: unknown): SiteContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const doc = raw as SanitySite;
  const images = imagesRecord(doc.images);
  return parseStoredContent(JSON.stringify({ ...doc, images }));
}

export async function fetchSanitySite(): Promise<SiteContent | null> {
  const client = getSanityClient();
  if (!client) return null;
  const raw: unknown = await client.fetch(siteQuery);
  return siteContentFromSanity(raw);
}
