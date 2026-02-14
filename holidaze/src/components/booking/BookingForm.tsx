import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createBooking } from "../../api/bookings";
import type { Venue } from "../../types/venue";
import { getUser } from "../../utils/auth";

type Props = { venue: Venue };

export default function BookingForm({ venue }: Props) {
  const navigate = useNavigate();
  const user = getUser<{ venueManager: boolean }>();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!dateFrom || !dateTo) return 0;
    const diff = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }, [dateFrom, dateTo]);

  const total = nights * venue.price;
  const today = new Date().toISOString().slice(0, 10);

  const isDisabled = loading || !user || user?.venueManager;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Guards
    if (!user) return setError("You must be logged in to book");
    if (user.venueManager)
      return setError("Venue managers cannot book venues.");
    if (!dateFrom || !dateTo) return setError("Please select both dates.");

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
      return setError("Invalid dates.");

    if (to <= from) return setError("Check-out must be after check-in.");
    if (guests < 1) return setError("Guests must be at least 1.");
    if (guests > venue.maxGuests)
      return setError(`Max guests is ${venue.maxGuests}.`);

    try {
      setLoading(true);

      // create booking
      const booking = await createBooking({
        venueId: venue.id,
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        guests,
      });

      //  redirect to confirmation page
      navigate("/booking-confirmed", {
        state: {
          venue,
          bookingId: (booking as any)?.id,
          dateFrom,
          dateTo,
          guests,
          nights,
          total,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Book this venue</h2>

      {/* Alerts */}
      {!user && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Please log in to make a booking.
        </div>
      )}

      {user?.venueManager && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Venue managers cannot book venues.
        </div>
      )}

      {/* Inputs */}
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Check-in</span>
          <input
            type="date"
            min={today}
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              if (dateTo && new Date(e.target.value) >= new Date(dateTo)) {
                setDateTo("");
              }
            }}
            className="h-11 rounded-xl border px-3"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Check-out</span>
          <input
            type="date"
            min={dateFrom || today}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-11 rounded-xl border px-3"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Guests</span>
          <input
            type="number"
            min={1}
            max={venue.maxGuests}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="h-11 rounded-xl border px-3"
          />
        </label>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
        <p className="text-sm text-gray-600">
          Nights: <span className="font-semibold text-gray-900">{nights}</span>
        </p>
        <p className="text-sm text-gray-600">
          Total: <span className="font-bold text-pink-600">{total} kr</span>
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={isDisabled}
        className="h-12 w-full rounded-xl bg-pink-500 px-6 text-white font-bold shadow-sm hover:bg-pink-600 active:scale-[0.99] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A1B7B]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Booking..." : "Book now"}
      </button>

      <p className="text-xs text-gray-500">
        Price per night: {venue.price} kr • Max guests: {venue.maxGuests}
      </p>
    </form>
  );
}
