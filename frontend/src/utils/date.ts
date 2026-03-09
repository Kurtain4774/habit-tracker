export function yyyyMmDd(d: Date) {
  return d.toLocaleDateString("en-CA");
}

export function formatPrettyDate(dateStr: string) {
  const d = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}