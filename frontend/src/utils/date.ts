export function yyyyMmDd(d: Date) {
  return d.toLocaleDateString("en-CA");
}

// utils/date.ts

/** Convert "YYYY-MM-DD" string to Date at UTC midnight */
export function toDateOnlyUTC(dateStr: string): Date {
  const dt = new Date(`${dateStr}T00:00:00.000Z`);
  if (isNaN(dt.getTime())) throw new Error("Invalid date");
  return dt;
}

/** Return YYYY-MM-DD string from a Date (UTC) */
export function dateKeyUTC(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Return today's date at UTC midnight */
export function todayUTCDateOnly(): Date {
  return toDateOnlyUTC(new Date().toISOString().slice(0, 10));
}

/** Add days to a YYYY-MM-DD string, return YYYY-MM-DD */
export function addDaysUTC(dateStr: string, days: number): string {
  const dt = toDateOnlyUTC(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dateKeyUTC(dt);
}

/** Return start of the week (Monday) for a YYYY-MM-DD string */
export function startOfWeekUTC(dateStr: string): string {
  const dt = toDateOnlyUTC(dateStr);
  const day = dt.getUTCDay(); // 0=Sun ... 6=Sat
  const offset = (day + 6) % 7; // Make Monday=0
  dt.setUTCDate(dt.getUTCDate() - offset);
  return dateKeyUTC(dt);
}

export function formatPrettyDate(dateStr: string) {
  const d = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}