/** Public Sanity ids. Empty until the project is created. */
export function sanityProjectId(): string {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';
}

export function sanityDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
}

export function isSanityConfigured(): boolean {
  return sanityProjectId().length > 0;
}
