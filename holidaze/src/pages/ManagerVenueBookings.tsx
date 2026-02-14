import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVenueByIdWithBookings } from "../api/venues";
import type { VenueWithBookings, VenueBooking } from "../types/venue";

export default function ManagerVenueBookings() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<VenueWithBookings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const v = await getVenueByIdWithBookings(id);

        setVenue(v);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!venue) return <p className="p-6">Venue not found</p>;

  const bookings = venue.bookings ?? [];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings for: {venue.name}</h1>
        <Link
          to={`/manager/venues/${venue.id}/edit`}
          className="underline  hover:text-[#6A1B7B]"
        >
          Back to edit
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="grid gap-3">
          {bookings.map((b: VenueBooking) => (
            <li key={b.id} className="rounded-xl border p-4 space-y-1">
              <p>
                <strong>From:</strong>{" "}
                {new Date(b.dateFrom).toLocaleDateString()}
              </p>
              <p>
                <strong>To:</strong> {new Date(b.dateTo).toLocaleDateString()}
              </p>
              <p>
                <strong>Guests:</strong> {b.guests}
              </p>
              {b.customer && (
                <p className="text-sm text-gray-600">
                  <strong>Customer:</strong> {b.customer.name} (
                  {b.customer.email})
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
