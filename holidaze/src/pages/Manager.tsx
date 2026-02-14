import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";
import { getMyVenues } from "../api/venues";
import type { Venue } from "../types/venue";

export default function ManagerVenues() {
  const user = getUser();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.name) return;

    (async () => {
      try {
        setError(null);
        const data = await getMyVenues(user.name);
        setVenues(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load venues");
      }
    })();
  }, [user?.name]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My venues</h1>

        <Link to="/manager/create" className="rounded btn-primary">
          Create venue
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {!error && venues.length === 0 && <p>You have no venues yet.</p>}

      {/* thumbnails + edit */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((v) => {
          const img = v.media?.[0]?.url ?? "https://placehold.co/600x400";
          const alt = v.media?.[0]?.alt ?? v.name;

          return (
            <li
              key={v.id}
              className="rounded-2xl border bg-white overflow-hidden"
            >
              <img src={img} alt={alt} className="h-40 w-full object-cover" />

              <div className="p-4 space-y-3">
                <p className="font-semibold">{v.name}</p>

                <div className="flex gap-4">
                  <Link
                    to={`/manager/venues/${v.id}/edit`}
                    className="btn-secondary "
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/manager/venues/${v.id}/bookings`}
                    className="btn-secondary"
                  >
                    View bookings
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
