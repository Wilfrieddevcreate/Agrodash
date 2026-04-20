/**
 * Minimal date helpers for the Calendar module.
 * No external libs (no date-fns / dayjs).
 *
 * Week starts on Monday (ISO 8601).
 */

export function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1, 0, 0, 0, 0);
}

/** Returns Monday=0, Sunday=6 offset for the given date. */
export function mondayIndex(d: Date): number {
  // JS: 0=Sun..6=Sat → shift so Mon=0..Sun=6
  return (d.getDay() + 6) % 7;
}

/** Monday of the ISO week containing d. */
export function startOfISOWeek(d: Date): Date {
  const out = startOfDay(d);
  out.setDate(out.getDate() - mondayIndex(out));
  return out;
}

/**
 * 42 consecutive Date cells (6 rows × 7 cols) starting from the Monday of
 * the week containing day 1 of the month of `d`.
 */
export function daysInMonthGrid(d: Date): Date[] {
  const first = startOfMonth(d);
  const gridStart = startOfISOWeek(first);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(addDays(gridStart, i));
  }
  return cells;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(d: Date, reference: Date = new Date()): boolean {
  return isSameDay(d, reference);
}

/** "April 2026" style */
export function formatMonthYear(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "Apr" (3 letter short month) */
export function formatMonthShort(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d);
}

/** "Mon, Apr 20" */
export function formatDayLong(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

/** "09:30" 24h */
export function formatTime(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/** "09:30 – 11:00" or "All day" or "09:30 – 11:00 · Apr 21" if multi-day */
export function formatEventTimeRange(
  start: Date,
  end: Date,
  allDay?: boolean
): string {
  if (allDay) return "All day";
  const sameDay = isSameDay(start, end);
  if (sameDay) return `${formatTime(start)} – ${formatTime(end)}`;
  return `${formatTime(start)} – ${formatTime(end)} · ${formatDayLong(end)}`;
}

/** "YYYY-MM-DD" for <input type="date"> values — local time. */
export function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "HH:MM" for <input type="time"> values — local time. */
export function toTimeInputValue(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/** ISO week weekday labels, Monday first. */
export const WEEKDAYS_SHORT = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;
