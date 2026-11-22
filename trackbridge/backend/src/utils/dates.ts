import { env } from '../config/env.js';

export const TZ = env.TZ || 'Africa/Addis_Ababa';

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function iso(d: Date | null | undefined) {
  return d ? d.toISOString() : null;
}

/** Next occurrence of weekday (0=Sun) at 23:59 from periodEnd. */
export function dueAtForWeek(periodEnd: Date, weekday: number) {
  const d = new Date(periodEnd);
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 0, 0);
  return d;
}

export function formatDisplay(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
