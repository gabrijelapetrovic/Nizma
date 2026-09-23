import { type SiteContent } from './store';

const IDB_PREFIX = 'idb:';

export function sanitizePhotoName(name: string): string | null {
  const base = name
    .replace(/^idb:/i, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || null;
}

export function photoExtFromType(type: string): 'webp' | 'jpg' | 'png' {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  return 'webp';
}

export function publicPhotoUrl(name: string, type: string): string | null {
  const base = sanitizePhotoName(name);
  if (!base) return null;
  return `/assets/photos/${base}.${photoExtFromType(type)}`;
}

export function gitPhotoPath(name: string, type: string): string | null {
  const url = publicPhotoUrl(name, type);
  return url ? `src${url}` : null;
}

export function collectUsedPhotoGitPaths(content: unknown): string[] {
  const paths = new Set<string>();
  const visit = (value: unknown) => {
    if (typeof value === 'string') {
      const path = value.split('?')[0];
      const match = path.match(/^\/(?:assets\/)?photos\/([a-zA-Z0-9._-]+)$/);
      if (match) paths.add(`src/assets/photos/${match[1]}`);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value && typeof value === 'object') {
      Object.values(value).forEach(visit);
    }
  };
  visit(content);
  return [...paths];
}

export function unusedPhotoGitPaths(existing: string[], used: string[]): string[] {
  const keep = new Set(used);
  return existing.filter((path) => path !== 'src/assets/photos/.gitkeep' && !keep.has(path));
}

export function collectPrivateImageIds(content: SiteContent): string[] {
  const ids = new Set<string>();
  const visit = (value: unknown) => {
    if (typeof value === 'string' && value.startsWith(IDB_PREFIX)) {
      const id = value.slice(IDB_PREFIX.length);
      if (id) ids.add(id);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value && typeof value === 'object') {
      Object.values(value).forEach(visit);
    }
  };
  visit(content);
  return [...ids];
}

export function replacePrivateImageSrcs(content: SiteContent, urls: Record<string, string>): SiteContent {
  const visit = (value: unknown): unknown => {
    if (typeof value === 'string' && value.startsWith(IDB_PREFIX)) {
      const id = value.slice(IDB_PREFIX.length);
      return urls[id] || value;
    }
    if (Array.isArray(value)) return value.map(visit);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, visit(child)]));
    }
    return value;
  };
  return visit(content) as SiteContent;
}
