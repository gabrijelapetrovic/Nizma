import { hasInjectionPayload } from './security';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const SESSION_MS = 45 * 60 * 1000;
const ATTEMPT_KEY = 'studio-admin-attempts';
const SESSION_KEY = 'studio-admin-session';
const LEGACY_ATTEMPT_KEY = 'freedom-admin-attempts';
const LEGACY_SESSION_KEY = 'freedom-admin-session';

/** SHA-256 of the local default PIN `freedom` — override with VITE_ADMIN_PIN_HASH in production. */
export const FALLBACK_PIN_HASH = '13b1f7ec5beaefc781e43a3b344371cd49923a8a05edd71844b92f56f6a08d38';

export async function sha256Hex(value: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function expectedPinHash(): Promise<string> {
  const hashed = import.meta.env.VITE_ADMIN_PIN_HASH?.trim().toLowerCase();
  if (hashed && /^[a-f0-9]{64}$/.test(hashed)) return hashed;
  const pin = import.meta.env.VITE_ADMIN_PIN?.trim();
  if (pin) return sha256Hex(pin);
  return FALLBACK_PIN_HASH;
}

function readSessionItem(key: string, legacyKey: string): string | null {
  return sessionStorage.getItem(key) || sessionStorage.getItem(legacyKey);
}

export function readLockout(): { lockedUntil: number; fails: number } {
  try {
    const parsed = JSON.parse(readSessionItem(ATTEMPT_KEY, LEGACY_ATTEMPT_KEY) || 'null') as {
      lockedUntil?: number;
      fails?: number;
    } | null;
    return {
      lockedUntil: typeof parsed?.lockedUntil === 'number' ? parsed.lockedUntil : 0,
      fails: typeof parsed?.fails === 'number' ? parsed.fails : 0,
    };
  } catch {
    return { lockedUntil: 0, fails: 0 };
  }
}

export function isLockedOut(now = Date.now()): boolean {
  return readLockout().lockedUntil > now;
}

function writeLockout(fails: number, lockedUntil: number) {
  sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ fails, lockedUntil }));
  sessionStorage.removeItem(LEGACY_ATTEMPT_KEY);
}

export function recordFailedPin(now = Date.now()): number {
  const current = readLockout();
  const fails = current.fails + 1;
  const lockedUntil = fails >= MAX_ATTEMPTS ? now + LOCK_MS : 0;
  writeLockout(fails, lockedUntil);
  return Math.max(0, MAX_ATTEMPTS - fails);
}

export function clearLockout() {
  sessionStorage.removeItem(ATTEMPT_KEY);
  sessionStorage.removeItem(LEGACY_ATTEMPT_KEY);
}

export function startAdminSession(now = Date.now()) {
  const token = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, exp: now + SESSION_MS }));
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
}

export function hasValidAdminSession(now = Date.now()): boolean {
  try {
    const parsed = JSON.parse(readSessionItem(SESSION_KEY, LEGACY_SESSION_KEY) || 'null') as {
      token?: string;
      exp?: number;
    } | null;
    if (!parsed?.token || typeof parsed.exp !== 'number') return false;
    if (parsed.exp < now) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isSafeAdminPin(pin: string): boolean {
  if (!pin || pin.length > 64) return false;
  if (hasInjectionPayload(pin)) return false;
  return /^[\p{L}\p{N}!@#$%^&*._\-+=?]+$/u.test(pin);
}

export async function verifyAdminPin(pin: string): Promise<boolean> {
  if (!isSafeAdminPin(pin)) return false;
  const [incoming, expected] = await Promise.all([sha256Hex(pin), expectedPinHash()]);
  return timingSafeEqual(incoming, expected);
}
