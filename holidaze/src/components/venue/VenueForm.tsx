import { useState } from "react";

type Media = { url: string; alt?: string | null };
type Meta = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};
type Location = {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
};

export type VenueFormValues = {
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  meta: Meta;
  location: Location;
};

type Props = {
  initial?: Partial<VenueFormValues>;
  onSubmit: (values: VenueFormValues) => Promise<void> | void;
  submitLabel?: string;
};

export default function VenueForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.media?.[0]?.url ?? "");
  const [price, setPrice] = useState(Number(initial?.price ?? 0));
  const [maxGuests, setMaxGuests] = useState(Number(initial?.maxGuests ?? 1));

  const [wifi, setWifi] = useState(Boolean(initial?.meta?.wifi ?? false));
  const [parking, setParking] = useState(
    Boolean(initial?.meta?.parking ?? false),
  );
  const [breakfast, setBreakfast] = useState(
    Boolean(initial?.meta?.breakfast ?? false),
  );
  const [pets, setPets] = useState(Boolean(initial?.meta?.pets ?? false));

  const [city, setCity] = useState(initial?.location?.city ?? "");
  const [country, setCountry] = useState(initial?.location?.country ?? "");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required");
    if (!description.trim()) return setError("Description is required");
    if (price <= 0) return setError("Price must be greater than 0");
    if (maxGuests < 1) return setError("Max guests must be at least 1");

    const values: VenueFormValues = {
      name: name.trim(),
      description: description.trim(),
      media: imageUrl.trim()
        ? [{ url: imageUrl.trim(), alt: name.trim() }]
        : [],
      price,
      maxGuests,
      rating: 0,
      meta: { wifi, parking, breakfast, pets },
      location: {
        address: "", // ok (API default null/empty)
        city: city.trim(),
        zip: "",
        country: country.trim(),
        continent: "",
        lat: 0,
        lng: 0,
      },
    };

    try {
      setLoading(true);
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save venue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <input
        className="w-full border rounded p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Venue name"
      />

      <textarea
        className="w-full border rounded p-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <input
        className="w-full border rounded p-2"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />
      {imageUrl.trim() && (
        <img
          src={imageUrl}
          alt={name || "Venue preview"}
          className="w-full h-48 object-cover rounded-xl border"
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <input
          className="w-full border rounded p-2"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price per night"
        />
        <input
          className="w-full border rounded p-2"
          type="number"
          value={maxGuests}
          onChange={(e) => setMaxGuests(Number(e.target.value))}
          placeholder="Max guests"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="w-full border rounded p-2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <input
          className="w-full border rounded p-2"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wifi}
            onChange={(e) => setWifi(e.target.checked)}
          />{" "}
          Wifi
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={parking}
            onChange={(e) => setParking(e.target.checked)}
          />{" "}
          Parking
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={breakfast}
            onChange={(e) => setBreakfast(e.target.checked)}
          />{" "}
          Breakfast
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pets}
            onChange={(e) => setPets(e.target.checked)}
          />{" "}
          Pets
        </label>
      </div>

      <button disabled={loading} className="btn-secondary">
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
