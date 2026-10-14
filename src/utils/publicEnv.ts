/**
 * Reads Vite (`VITE_*`) and Next (`NEXT_PUBLIC_*` / `NODE_ENV`) without
 * changing the values the salon already uses.
 */
function readEnv(names: string[]): string | undefined {
  for (const name of names) {
    const fromProcess = typeof process !== 'undefined' ? process.env[name] : undefined;
    if (typeof fromProcess === 'string' && fromProcess.trim()) return fromProcess.trim();
  }
  try {
    const env = import.meta.env as Record<string, string | boolean | undefined> | undefined;
    if (!env) return undefined;
    for (const name of names) {
      const value = env[name];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function publicEnv(viteName: string, nextName: string, fallback = ''): string {
  return readEnv([nextName, viteName]) || fallback;
}

export function isTestMode(): boolean {
  try {
    if (import.meta.env?.MODE === 'test') return true;
    if (import.meta.env?.VITEST) return true;
  } catch {
    /* Next server has no Vite env. */
  }
  return process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';
}

export function isProdBuild(): boolean {
  try {
    if (import.meta.env?.PROD === true) return true;
  } catch {
    /* Next. */
  }
  return process.env.NODE_ENV === 'production';
}
