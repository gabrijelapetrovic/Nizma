import { describe, expect, it } from 'vitest';
import { MESSAGES } from '../i18n/translations';

describe('i18n dictionaries', () => {
  it('has the same keys in Serbian and English', () => {
    const srKeys = Object.keys(MESSAGES.sr).sort();
    const enKeys = Object.keys(MESSAGES.en).sort();
    expect(enKeys).toEqual(srKeys);
    expect(MESSAGES.sr['hours.monFri']).toBe('Ponedeljak - Petak');
    expect(MESSAGES.en['hours.monFri']).toBe('Monday – Friday');
    expect(MESSAGES.sr['hours.monThu']).toBeUndefined();
  });
});
