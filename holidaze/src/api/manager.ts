// src/api/manager.ts
import { apiFetch } from "./client";
import { HOLIDAZE_BASE } from "../utils/constants";
import type { Booking } from "../types/booking";
import type { Venue } from "../types/venue";

type ApiResponse<T> = { data: T; meta: Record<string, unknown> };
type VenueWithBookings = Venue & { bookings?: Booking[] };

export async function getProfileBookings(
  managerName: string,
): Promise<Booking[]> {
  const url = `${HOLIDAZE_BASE}/profiles/${managerName}/venues?_bookings=true&_customer=true`;

  const res = await apiFetch<ApiResponse<VenueWithBookings[]>>(url);
  const venues = res.data ?? [];

  // flatten venue.bookings into one array
  return venues.flatMap((v) =>
    (v.bookings ?? []).map((b) => ({
      ...b,
      venue: b.venue ?? v,
    })),
  );
}
