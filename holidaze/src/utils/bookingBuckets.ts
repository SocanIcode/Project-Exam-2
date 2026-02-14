function toTimeEndOfDay(iso: string) {
  const hasTime = iso.includes("T");
  const normalized = hasTime ? iso : `${iso}T23:59:59.999`;
  return new Date(normalized).getTime();
}

export function isUpcoming(_dateFrom: string, dateTo: string) {
  const now = Date.now();
  const to = toTimeEndOfDay(dateTo);
  return now <= to;
}

export function isPast(dateTo: string) {
  const now = Date.now();
  const to = toTimeEndOfDay(dateTo);
  return now > to;
}
