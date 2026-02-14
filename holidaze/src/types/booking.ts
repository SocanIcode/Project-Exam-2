import type { Venue } from "./venue";

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
  customer?: {
    name: string;
    email: string;
    bio?: string;
    avatar?: { url: string; alt?: string };
    banner?: { url: string; alt?: string };
  };
};

export type CreateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type ApiResponse<T> = {
  data: T;
  meta: Record<string, unknown>;
};
