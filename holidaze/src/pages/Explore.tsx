import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VenueCard from "../components/ui/VenueCard";
import { getVenues } from "../api/venues";
import type { Venue } from "../types/venue";

export default function Explore() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get("q") ?? "";
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const guestsParam = Number(searchParams.get("guests") ?? "1");
  const roomsParam = Number(searchParams.get("rooms") ?? "1");

  const [q, setQ] = useState(qParam);
  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [guests, setGuests] = useState(
    Number.isFinite(guestsParam) ? guestsParam : 1,
  );
  const [rooms, setRooms] = useState(
    Number.isFinite(roomsParam) ? roomsParam : 1,
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVenues();
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );
        setVenues(sorted);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load venues");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const query = (searchParams.get("q") ?? "").trim().toLowerCase();
    const guestsFilter = Number(searchParams.get("guests") ?? "1") || 1;

    let list = venues;

    if (query) {
      list = list.filter((v) => v.name.toLowerCase().includes(query));
    }

    // guests filter
    list = list.filter((v) => (v.maxGuests ?? 0) >= guestsFilter);

    return list;
  }, [venues, searchParams]);

  function onBookNow(e: React.FormEvent) {
    e.preventDefault();

    // store filters in URL
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      if (q.trim()) p.set("q", q.trim());
      else p.delete("q");

      if (dateFrom) p.set("from", dateFrom);
      else p.delete("from");

      if (dateTo) p.set("to", dateTo);
      else p.delete("to");

      p.set("guests", String(guests || 1));
      p.set("rooms", String(rooms || 1));

      return p;
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* HERO page  */}
      <section className="relative rounded-2xl overflow-hidden border">
        <img
          src="https://wudasi0808.live-website.com/wp-content/uploads/2026/02/Business-Website-1.png"
          alt="Hotel hero"
          className="h-56 md:h-72 w-full object-cover"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            className="text-3xl md:text-5xl font-bold text-white drop-shadow-md shadow-[#6A1B7B}-40
          %"
          >
            Discover the best living offer!
          </h1>
          <p className="mt-3 text-base md:text-lg text-white drop-shadow">
            Plan your best trip with best time for your money!
          </p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <form
        onSubmit={onBookNow}
        className="rounded-2xl border bg-white p-4 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="rounded-xl border px-4 py-3"
          />

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border px-4 py-3"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border px-4 py-3"
          />

          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="rounded-xl border px-4 py-3"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <select
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="rounded-xl border px-4 py-3"
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} Room{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" className="btn-primary">
            Book Now
          </button>
        </div>
      </form>

      {/* LIST */}
      {loading && <p>Loading venues…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <div key={String((venue as any).id)}>
              <VenueCard venue={venue} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
