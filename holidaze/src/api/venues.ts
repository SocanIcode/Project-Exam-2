import { apiFetch } from "./client";
import { HOLIDAZE_BASE } from "../utils/constants";
import type { Venue, VenueWithBookings } from "../types/venue";
import type { ApiResponse } from "../types/booking";

const VENUES_URL = `${HOLIDAZE_BASE}/venues`;

export type CreateVenuePayload = Pick<
  Venue,
  | "name"
  | "description"
  | "media"
  | "price"
  | "maxGuests"
  | "rating"
  | "meta"
  | "location"
>;

// ✅ Updated: supports pagination (but still defaults to limit=100, page=1)
export async function getVenues(params?: {
  limit?: number;
  page?: number;
  sort?: "created" | "updated";
  sortOrder?: "asc" | "desc";
}): Promise<Venue[]> {
  const limit = params?.limit ?? 100;
  const page = params?.page ?? 1;
  const sort = params?.sort ?? "created";
  const sortOrder = params?.sortOrder ?? "desc";

  const url = `${VENUES_URL}?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;

  const res = await apiFetch<ApiResponse<Venue[]>>(url);
  return res.data ?? [];
}

// server-inside
export async function searchVenues(q: string): Promise<Venue[]> {
  const query = q.trim();
  if (!query) return [];

  const res = await apiFetch<ApiResponse<Venue[]>>(
    `${VENUES_URL}/search?q=${encodeURIComponent(query)}`,
  );

  return res.data ?? [];
}

export async function getVenueById(id: string): Promise<Venue> {
  const res = await apiFetch<ApiResponse<Venue>>(`${VENUES_URL}/${id}`);
  return res.data;
}

export async function getVenuesByProfile(name: string): Promise<Venue[]> {
  const res = await apiFetch<ApiResponse<Venue[]>>(
    `${HOLIDAZE_BASE}/profiles/${name}/venues`,
  );
  return res.data ?? [];
}

export async function createVenue(payload: CreateVenuePayload): Promise<Venue> {
  const res = await apiFetch<ApiResponse<Venue>>(VENUES_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateVenue(
  id: string,
  payload: Partial<CreateVenuePayload>,
): Promise<Venue> {
  const res = await apiFetch<ApiResponse<Venue>>(`${VENUES_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteVenue(id: string): Promise<void> {
  await apiFetch(`${VENUES_URL}/${id}`, { method: "DELETE" });
}

export async function getVenueByIdWithBookings(
  id: string,
): Promise<VenueWithBookings> {
  const res = await apiFetch<ApiResponse<VenueWithBookings>>(
    `${VENUES_URL}/${id}?_bookings=true&_owner=true`,
  );
  return res.data;
}

export async function getMyVenues(profileName: string): Promise<Venue[]> {
  const res = await apiFetch<ApiResponse<Venue[]>>(
    `${HOLIDAZE_BASE}/profiles/${profileName}/venues?_bookings=true&_owner=true`,
  );
  return res.data ?? [];
}
