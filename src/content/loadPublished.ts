import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cache } from 'react';
import { parseStoredContent, type SiteContent } from './store';
import { fetchSanitySite } from '../../sanity/lib/fetchSite';
import { isSanityConfigured } from '../../sanity/env';

function readLocalSite(): SiteContent {
  const raw = readFileSync(join(process.cwd(), 'public', 'site-content.json'), 'utf8');
  return parseStoredContent(raw);
}

/**
 * Server loader. Sanity is used only after the project id is set.
 * Until then the page renders the same published JSON as before.
 */
export const loadPublishedSiteContent = cache(async (): Promise<SiteContent> => {
  if (!isSanityConfigured()) return readLocalSite();
  try {
    const fromSanity = await fetchSanitySite();
    if (fromSanity) return fromSanity;
    console.warn('[sanity] document "site" is missing, using public/site-content.json');
  } catch (error) {
    console.error('[sanity] read failed, using public/site-content.json', error);
  }
  return readLocalSite();
});
