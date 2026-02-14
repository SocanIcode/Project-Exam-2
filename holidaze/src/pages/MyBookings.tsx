import { useEffect, useState } from "react";
import type { Booking } from "../types/booking";
import { deleteBooking, getMyBookings, updateBooking } from "../api/bookings";
import { canEditBooking } from "../utils/time";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // edit booking”
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyBookings();
      setBookings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  function startEdit(b: Booking) {
    setEditingId(b.id);
    setDateFrom(b.dateFrom.slice(0, 10));
    setDateTo(b.dateTo.slice(0, 10));
    setGuests(b.guests);
  }

  async function saveEdit() {
    if (!editingId) return;

    try {
      const updated = await updateBooking(editingId, {
        dateFrom,
        dateTo,
        guests,
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === editingId ? updated : b)),
      );
      setEditingId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  }

  if (loading) return <p className="p-4">Loading bookings…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {bookings.length === 0 && <p>You have no bookings yet.</p>}

      <div className="grid gap-4">
        {bookings.map((b) => {
          const editable = canEditBooking(b.dateFrom);

          return (
            <div
              key={b.id}
              className="rounded-2xl border bg-white p-4 shadow-sm space-y-3"
            >
              <div className="flex gap-4 items-start">
                {/* Thumbnail */}
                <img
                  src={b.venue?.media?.[0]?.url || "https://placehold.co/96x96"}
                  alt={
                    b.venue?.media?.[0]?.alt || b.venue?.name || "Venue image"
                  }
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />

                {/* Booking info */}
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{b.venue?.name ?? "Venue"}</p>

                  <p className="text-sm text-gray-600">
                    {b.dateFrom.slice(0, 10)} → {b.dateTo.slice(0, 10)}
                  </p>

                  <p className="text-sm text-gray-600">{b.guests} guests</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onDelete(b.id)}
                    disabled={!editable}
                    className="btn-secondary hover:bg-[#9C275F]"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => startEdit(b)}
                    disabled={!canEditBooking(b.dateFrom)}
                    className="btn-secondary"
                  >
                    Manage
                  </button>
                </div>
              </div>

              {!editable && (
                <p className="text-sm text-amber-700">
                  You can’t edit this booking because check-in is less than 24
                  hours away.
                </p>
              )}

              {editingId === b.id && (
                <div className="grid gap-2 pt-2">
                  <div className="grid sm:grid-cols-3 gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="rounded-xl border p-2"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="rounded-xl border p-2"
                    />
                    <input
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="rounded-xl border p-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="btn-secondary">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-xl border px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
