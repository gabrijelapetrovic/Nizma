import { describe, it, expect } from 'vitest';
import { bookingSlotsForDate, firstBookableDate, getVenueStatus } from '../utils/hours';
import { BUSINESS_INFO } from '../utils/constants';
import { type WorkingHours } from '../types';

const hours = BUSINESS_INFO.workingHours;

const overnight: WorkingHours[] = [
  {
    id: 'fri',
    days: 'Petak',
    hours: '09:00 - 01:00',
    weekdays: [5],
    openTime: '09:00',
    closeTime: '01:00',
  },
];

describe('Studio opening hours', () => {
  it('is open on Monday after 09:00', () => {
    const monday = new Date(2026, 8, 7, 10, 0, 0);
    expect(monday.getDay()).toBe(1);
    expect(getVenueStatus(hours, monday).isOpen).toBe(true);
  });

  it('is closed on Monday before opening', () => {
    const monday = new Date(2026, 8, 7, 8, 30, 0);
    expect(getVenueStatus(hours, monday).isOpen).toBe(false);
  });

  it('is open Friday evening and closed after 20:00', () => {
    const open = new Date(2026, 8, 4, 19, 0, 0);
    const closed = new Date(2026, 8, 4, 20, 30, 0);
    expect(open.getDay()).toBe(5);
    expect(getVenueStatus(hours, open).isOpen).toBe(true);
    expect(getVenueStatus(hours, closed).isOpen).toBe(false);
  });

  it('is open Saturday morning and closed after 15:00', () => {
    const open = new Date(2026, 8, 5, 10, 0, 0);
    const closed = new Date(2026, 8, 5, 16, 0, 0);
    expect(open.getDay()).toBe(6);
    expect(getVenueStatus(hours, open).isOpen).toBe(true);
    expect(getVenueStatus(hours, closed).isOpen).toBe(false);
  });

  it('is closed on Sunday', () => {
    const sunday = new Date(2026, 8, 6, 12, 0, 0);
    expect(sunday.getDay()).toBe(0);
    expect(getVenueStatus(hours, sunday).isOpen).toBe(false);
  });

  it('offers weekday slots before 20:00 and Saturday slots before 15:00', () => {
    expect(bookingSlotsForDate('2026-09-23', hours)).toEqual([
      '09:00',
      '10:30',
      '12:00',
      '13:30',
      '15:00',
      '17:00',
      '18:30',
    ]);
    expect(bookingSlotsForDate('2026-09-26', hours)).toEqual(['09:00', '10:30', '12:00', '13:30']);
    expect(bookingSlotsForDate('2026-09-27', hours)).toEqual([]);
    expect(firstBookableDate(hours, new Date(2026, 8, 27, 12, 0, 0))).toBe('2026-09-28');
  });

  it('still treats a close-after-midnight range as open past midnight', () => {
    const fridayNight = new Date(2026, 8, 4, 23, 30, 0);
    const saturdayEarly = new Date(2026, 8, 5, 0, 30, 0);
    expect(getVenueStatus(overnight, fridayNight).isOpen).toBe(true);
    expect(getVenueStatus(overnight, saturdayEarly).isOpen).toBe(true);
    expect(getVenueStatus(overnight, new Date(2026, 8, 5, 2, 0, 0)).isOpen).toBe(false);
  });
});
