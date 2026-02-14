import { useEffect, useMemo, useState } from "react";
import VenueCard from "../components/ui/VenueCard";
import { getVenues } from "../api/venues";
import type { Venue } from "../types/venue";

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVenues({
          limit: 100,
          page: 1,
          sort: "created",
          sortOrder: "desc",
        });

        setVenues(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load venues");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return venues;

    return venues.filter((v) => {
      const name = v.name?.toLowerCase() ?? "";
      const desc = v.description?.toLowerCase() ?? "";
      const city = v.location?.city?.toLowerCase() ?? "";
      const country = v.location?.country?.toLowerCase() ?? "";

      return (
        name.includes(q) ||
        desc.includes(q) ||
        city.includes(q) ||
        country.includes(q)
      );
    });
  }, [venues, query]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold">Venues</h1>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues..."
          className="w-full md:max-w-md rounded-xl border px-4 py-2"
        />
      </header>

      {loading && <p>Loading venues…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <div key={venue.id}>
              <VenueCard venue={venue} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
