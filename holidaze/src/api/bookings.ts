import { apiFetch } from "./client";
import { HOLIDAZE_BASE } from "../utils/constants";
import type {
  ApiResponse,
  Booking,
  CreateBookingPayload,
} from "../types/booking";
import { getUser } from "../utils/auth";

const BOOKINGS_URL = `${HOLIDAZE_BASE}/bookings`;

export async function createBooking(payload: CreateBookingPayload) {
  const res = await apiFetch<ApiResponse<Booking>>(BOOKINGS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.data;
}

export async function deleteBooking(id: string) {
  await apiFetch(`${BOOKINGS_URL}/${id}`, { method: "DELETE" });
}

export type UpdateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
};

export async function updateBooking(id: string, payload: UpdateBookingPayload) {
  const res = await apiFetch<ApiResponse<Booking>>(`${BOOKINGS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data;
}
export async function getMyBookings(): Promise<Booking[]> {
  const user = getUser<{ name: string }>();
  if (!user?.name) return [];

  const url = `${HOLIDAZE_BASE}/profiles/${user.name}/bookings?_venue=true`;

  const res = await apiFetch<ApiResponse<Booking[]>>(url);
  return res.data ?? [];
}
