import { type WorkingHours } from '../types';

export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return hours * 60 + minutes;
}

export function isOvernightRange(openTime: string, closeTime: string): boolean {
  return timeToMinutes(closeTime) <= timeToMinutes(openTime);
}

export function formatHoursLabel(openTime: string, closeTime: string): string {
  return `${openTime} - ${closeTime}`;
}

const BOOKING_SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '17:00', '18:30'] as const;

function isoFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** The next day the studio is open, starting from today. */
export function firstBookableDate(workingHours: WorkingHours[], from = new Date()): string {
  for (let offset = 0; offset < 8; offset += 1) {
    const date = new Date(from);
    date.setDate(from.getDate() + offset);
    const iso = isoFromDate(date);
    if (bookingSlotsForDate(iso, workingHours).length) return iso;
  }
  return isoFromDate(from);
}

/** Start times that fit inside the studio hours for that calendar day. Sunday has none. */
export function bookingSlotsForDate(dateIso: string, workingHours: WorkingHours[]): string[] {
  const day = new Date(`${dateIso}T12:00:00`).getDay();
  if (!Number.isFinite(day)) return [];
  const row = workingHours.find((item) => item.weekdays.includes(day));
  if (!row) return [];
  const open = timeToMinutes(row.openTime);
  const close = timeToMinutes(row.closeTime);
  const overnight = isOvernightRange(row.openTime, row.closeTime);
  return BOOKING_SLOTS.filter((slot) => {
    const minutes = timeToMinutes(slot);
    return overnight ? minutes >= open || minutes < close : minutes >= open && minutes < close;
  });
}

export function getVenueStatus(workingHours: WorkingHours[], now = new Date()) {
  const day = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = workingHours.find((row) => row.weekdays.includes(day));
  const yesterday = workingHours.find((row) => row.weekdays.includes((day + 6) % 7));

  if (yesterday && isOvernightRange(yesterday.openTime, yesterday.closeTime)) {
    const closeMin = timeToMinutes(yesterday.closeTime);
    if (nowMin < closeMin) {
      return {
        isOpen: true,
        hoursLabel: yesterday.hours || formatHoursLabel(yesterday.openTime, yesterday.closeTime),
        todayRow: today,
      };
    }
  }

  if (today) {
    const openMin = timeToMinutes(today.openTime);
    const closeMin = timeToMinutes(today.closeTime);
    const overnight = isOvernightRange(today.openTime, today.closeTime);
    const isOpen = overnight ? nowMin >= openMin : nowMin >= openMin && nowMin < closeMin;
    return {
      isOpen,
      hoursLabel: today.hours || formatHoursLabel(today.openTime, today.closeTime),
      todayRow: today,
    };
  }

  return { isOpen: false, hoursLabel: '', todayRow: undefined };
}
