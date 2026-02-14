export type VenueMedia = { url: string; alt?: string | null };

export type VenueMeta = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

export type VenueLocation = {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number;
  lng: number;
};

export type VenueOwner = {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
};

export type VenueBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer?: {
    name: string;
    email: string;
    bio?: string;
    avatar?: { url: string; alt?: string };
    banner?: { url: string; alt?: string };
  };
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: VenueMedia[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;

  owner?: VenueOwner;
};

export type VenueWithBookings = Venue & {
  bookings?: VenueBooking[];
};
