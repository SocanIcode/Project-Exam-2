export function canEditBooking(dateFrom: string) {
  const checkIn = new Date(dateFrom).getTime();
  const now = Date.now();
  const hoursLeft = (checkIn - now) / (1000 * 60 * 60);
  return hoursLeft >= 24;
}
