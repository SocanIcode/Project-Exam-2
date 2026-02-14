import { useNavigate } from "react-router-dom";
import VenueForm from "../components/venue/VenueForm";
import { createVenue } from "../api/venues";

export default function CreateVenue() {
  const navigate = useNavigate();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create venue</h1>

      <VenueForm
        submitLabel="Create"
        onSubmit={async (values) => {
          await createVenue(values);
          navigate("/manager");
        }}
      />
    </main>
  );
}
