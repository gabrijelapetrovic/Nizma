/**
 * Security, XSS sanitization and form validation.
 */

function stripForbiddenControls(input: string): string {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    const drop =
      code === 0 ||
      code === 127 ||
      (code >= 1 && code <= 8) ||
      code === 11 ||
      code === 12 ||
      (code >= 14 && code <= 31);
    if (!drop) result += input[i];
  }
  return result;
}
const HTML_TAGS = /<\/?[a-zA-Z][^>]*>?/g;
const EVENT_HANDLERS = /\bon[a-z]+\s*=/gi;
const DANGEROUS_PROTOCOLS = /(?:javascript|vbscript|data|file|blob)\s*:/gi;
const HEADER_INJECTION = /[\r\n]/;
const ENTITY_ATTACK = /(?:&#x?0+|expression\s*\()/i;

function assertString(input: unknown): input is string {
  return typeof input === 'string' && input.length > 0;
}

/**
 * True when the raw value looks like markup, event-handler or protocol injection.
 * Used to reject the field instead of silently rewriting it.
 */
export function hasInjectionPayload(input: string): boolean {
  if (!assertString(input)) return false;
  return (
    /<[^>]*>/.test(input) ||
    /\bon[a-z]+\s*=/i.test(input) ||
    /(?:javascript|vbscript|data|file|blob)\s*:/i.test(input) ||
    HEADER_INJECTION.test(input) ||
    input.includes('\0') ||
    ENTITY_ATTACK.test(input)
  );
}

/**
 * Strips HTML tags and removes dangerous scripts without entity-encoding
 * (useful for clean plain text display and JSON form submissions).
 */
export function cleanPlainText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return stripForbiddenControls(input.normalize('NFC'))
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(HTML_TAGS, '')
    .replace(EVENT_HANDLERS, '')
    .replace(DANGEROUS_PROTOCOLS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Alias used when sending values to an API (JSON), not into HTML. */
export function sanitizeForSubmit(input: string): string {
  return cleanPlainText(input);
}

/**
 * Sanitizes a string by stripping HTML tags and escaping special characters
 * to prevent Cross-Site Scripting (XSS) if the value is later interpolated into HTML.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return cleanPlainText(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;');
}

/**
 * Validates standard phone numbers allowing international formats, dashes, spaces, parentheses.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || hasInjectionPayload(phone)) return false;
  const sanitized = cleanPlainText(phone);
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,18}$/;
  return phoneRegex.test(sanitized) && sanitized.length <= 30;
}

/**
 * Validates email addresses strictly (length, shape, no injection).
 */
export function isValidEmail(email: string): boolean {
  if (!email || hasInjectionPayload(email)) return false;
  const sanitized = cleanPlainText(email).toLowerCase();
  if (sanitized.length > 254 || sanitized.includes('..')) return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(sanitized);
}

/**
 * Person names: letters (including Serbian), spaces, hyphen, apostrophe.
 */
export function isValidPersonName(name: string): boolean {
  if (!name || hasInjectionPayload(name)) return false;
  const sanitized = cleanPlainText(name);
  if (sanitized.length < 2 || sanitized.length > 80) return false;
  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(sanitized);
}

export function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calendar date (YYYY-MM-DD) from today up to one year ahead, using local time.
 */
export function isValidBookingDate(value: string): boolean {
  if (!value || hasInjectionPayload(value)) return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date(today);
  max.setDate(max.getDate() + 365);
  return parsed >= today && parsed <= max;
}

export function isAllowedOption(value: string, allowed: readonly string[]): boolean {
  return typeof value === 'string' && allowed.includes(value);
}

export function isValidGuestCount(guests: number, allowed: readonly number[]): boolean {
  return Number.isInteger(guests) && guests >= 1 && guests <= 30 && allowed.includes(guests);
}

/**
 * Validates text length against maximum characters.
 */
export function isSafeLength(input: string, minLength = 1, maxLength = 500): boolean {
  if (!input) return minLength === 0;
  const len = input.trim().length;
  return len >= minLength && len <= maxLength;
}
