import { createClient, type SanityClient } from '@sanity/client';
import { isSanityConfigured, sanityDataset, sanityProjectId } from '../env';

function sanityReadToken(): string | undefined {
  return process.env.SANITY_API_READ_TOKEN?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim() || undefined;
}

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;
  const token = sanityReadToken();
  return createClient({
    projectId: sanityProjectId(),
    dataset: sanityDataset(),
    apiVersion: '2026-10-14',
    useCdn: !token,
    token,
  });
}

export function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!isSanityConfigured() || !token) return null;
  return createClient({
    projectId: sanityProjectId(),
    dataset: sanityDataset(),
    apiVersion: '2026-10-14',
    useCdn: false,
    token,
  });
}
