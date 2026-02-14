import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../api/venues";
import type { Venue } from "../types/venue";
import BookingForm from "../components/booking/BookingForm";

export default function VenuePage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVenueById(id);

        setVenue(data);
      } catch {
        setError("Failed to load venue");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-4">Loading venue…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!venue) return <p className="p-4">Venue not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">{venue.name ?? "Untitled venue"}</h1>

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {venue.media?.length ? (
          venue.media.map((img, index) => (
            <img
              key={img.url ?? index}
              src={img.url}
              alt={img.alt ?? venue.name}
              className="rounded-xl object-cover w-full h-64"
            />
          ))
        ) : (
          <img
            src="https://placehold.co/800x400"
            alt="No image available"
            className="rounded-xl"
          />
        )}
      </div>

      {/* Info */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p>{venue.location?.address ?? "Address not provided"}</p>
          <p>
            {venue.location?.city ?? "City not provided"}
            {venue.location?.country ? `, ${venue.location.country}` : ""}
          </p>

          <p>
            <strong>Price:</strong> {venue.price} / night
          </p>
          <p>
            <strong>Max guests:</strong> {venue.maxGuests}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {venue.rating}
          </p>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <h3 className="font-semibold">Location</h3>
          <p>{venue.location?.address}</p>
          <p>
            {venue.location?.city}, {venue.location?.country}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3">
        {venue.meta?.wifi && <span className="badge">WiFi</span>}
        {venue.meta?.parking && <span className="badge">Parking</span>}
        {venue.meta?.breakfast && <span className="badge">Breakfast</span>}
        {venue.meta?.pets && <span className="badge">Pets allowed</span>}
      </div>

      {/* Booking */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <BookingForm venue={venue} />
      </div>
    </div>
  );
}
