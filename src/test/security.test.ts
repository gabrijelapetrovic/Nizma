import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  cleanPlainText,
  hasInjectionPayload,
  isValidEmail,
  isValidPhone,
  isValidPersonName,
  isValidBookingDate,
  isAllowedOption,
  isValidGuestCount,
  isSafeLength,
  todayIsoDate,
} from '../utils/security';

describe('Security & XSS Sanitization Utilities', () => {
  it('strips script tags and dangerous HTML elements from user input', () => {
    const maliciousScript = '<script>alert("XSS")</script>Marko';
    const sanitized = sanitizeInput(maliciousScript);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toContain('Marko');
  });

  it('escapes special characters into safe HTML entities', () => {
    const inputWithQuotes = '<img src="x" onerror="alert(1)" />';
    const sanitized = sanitizeInput(inputWithQuotes);
    expect(sanitized).not.toContain('<img');
    expect(sanitized).not.toContain('"');
  });

  it('removes javascript: pseudo-protocols and header-injection newlines', () => {
    expect(cleanPlainText('javascript:alert(document.cookie)')).not.toContain('javascript:');
    expect(cleanPlainText('vbscript:msgbox(1)')).not.toContain('vbscript:');
    expect(cleanPlainText('a@b.com\r\nBcc:evil@x.com')).not.toMatch(/[\r\n]/);
  });

  it('flags XSS and injection payloads before they are accepted', () => {
    expect(hasInjectionPayload('<script>alert(1)</script>')).toBe(true);
    expect(hasInjectionPayload('"><img src=x onerror=alert(1)>')).toBe(true);
    expect(hasInjectionPayload('javascript:alert(1)')).toBe(true);
    expect(hasInjectionPayload('ok@mail.com\ninjected')).toBe(true);
    expect(hasInjectionPayload('gost@luna.rs')).toBe(false);
  });

  it('validates email addresses properly and rejects invalid or injected emails', () => {
    expect(isValidEmail('korisnik@gmail.com')).toBe(true);
    expect(isValidEmail('test.name+filter@domain.co.rs')).toBe(true);
    expect(isValidEmail('  Gost@Nokti.rs  ')).toBe(true);

    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('<script>@bad.com')).toBe(false);
    expect(isValidEmail('user@domain.com<script>alert(1)</script>')).toBe(false);
    expect(isValidEmail('javascript:alert(1)@x.com')).toBe(false);
    expect(isValidEmail('a@b.com\ncc:evil@x.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('validates person names including Serbian letters and rejects XSS', () => {
    expect(isValidPersonName('Nikola Tesla')).toBe(true);
    expect(isValidPersonName('Ognjen Dabić')).toBe(true);
    expect(isValidPersonName('Ana-Marija')).toBe(true);
    expect(isValidPersonName('<script>alert(1)</script>')).toBe(false);
    expect(isValidPersonName('Marko123')).toBe(false);
    expect(isValidPersonName('A')).toBe(false);
  });

  it('validates phone numbers allowing common international and local formats', () => {
    expect(isValidPhone('0641234567')).toBe(true);
    expect(isValidPhone('+381 64 123 4567')).toBe(true);
    expect(isValidPhone('064/123-4567')).toBe(true);

    expect(isValidPhone('abc')).toBe(false);
    expect(isValidPhone('<script>alert(1)</script>')).toBe(false);
  });

  it('validates booking dates in local time and rejects invalid calendars', () => {
    expect(isValidBookingDate(todayIsoDate())).toBe(true);
    expect(isValidBookingDate('2020-01-01')).toBe(false);
    expect(isValidBookingDate('2026-13-40')).toBe(false);
    expect(isValidBookingDate('<svg>')).toBe(false);
  });

  it('whitelists select options and guest counts', () => {
    expect(isAllowedOption('18:30', ['09:00', '18:30'])).toBe(true);
    expect(isAllowedOption('99:99', ['09:00', '18:30'])).toBe(false);
    expect(isValidGuestCount(2, [1, 2, 4])).toBe(true);
    expect(isValidGuestCount(3, [1, 2, 4])).toBe(false);
  });

  it('verifies safe length bounds', () => {
    expect(isSafeLength('Valid text', 1, 50)).toBe(true);
    expect(isSafeLength('', 1, 50)).toBe(false);
    expect(isSafeLength('Too long string'.repeat(20), 1, 50)).toBe(false);
  });
});
