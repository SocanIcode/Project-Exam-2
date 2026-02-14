import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VenueForm from "../components/venue/VenueForm";
import { getVenueById, updateVenue, deleteVenue } from "../api/venues";
import type { Venue } from "../types/venue";

export default function EditVenue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setError(null);
        setVenue(await getVenueById(id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load venue");
      }
    })();
  }, [id]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!venue) return <p className="p-6">Loading…</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit venue</h1>

      <div className="flex gap-3">
        <button
          className="btn-secondary "
          onClick={() => navigate(`/manager/venues/${venue.id}/bookings`)}
        >
          View bookings
        </button>

        <button
          className="btn-secondary hover:bg-rose-700"
          onClick={async () => {
            if (!id) return;
            if (!confirm("Are you sure you want to delete this venue?")) return;

            try {
              await deleteVenue(id);
              navigate("/manager");
            } catch (e) {
              alert(e instanceof Error ? e.message : "Delete failed");
            }
          }}
        >
          Delete venue
        </button>
      </div>

      <VenueForm
        initial={venue as any}
        submitLabel="Update"
        onSubmit={async (values) => {
          if (!id) return;
          await updateVenue(id, values);
          navigate("/manager");
        }}
      />
    </main>
  );
}
