import { Link } from "react-router-dom";
import type { Venue } from "../../types/venue";

type Props = {
  venue: Venue;
};

export default function VenueCard({ venue }: Props) {
  const id = String((venue as any).id);

  const imgUrl = venue.media?.[0]?.url || "https://placehold.co/800x500";
  const imgAlt = venue.media?.[0]?.alt || venue.name || "Venue";

  const city = venue.location?.city?.trim();
  const country = venue.location?.country?.trim();
  const locationText =
    [city, country].filter(Boolean).join(", ") || "Location not provided";

  const shortDesc = (venue.description || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 70);

  return (
    <Link
      to={`/venue/${id}`}
      className="group block rounded-2xl border border-pink-300 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
      aria-label={`View ${venue.name}`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={imgUrl}
          alt={imgAlt}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#6A1B7B] leading-snug">
            {venue.name || "Untitled venue"}
          </h3>

          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{venue.rating ?? 0}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700">{locationText}</p>

        {shortDesc && (
          <p className="text-sm text-gray-600">
            {shortDesc}
            {venue.description && venue.description.length > 70 ? "…" : ""}
          </p>
        )}

        <div className="flex items-end justify-between pt-2">
          <p className="text-sm text-gray-700">
            From{" "}
            <span className="font-bold text-pink-600">
              {venue.price}kr/night
            </span>
          </p>

          {/* CTA Button */}
          <span className="inline-flex">
            <span className="btn-primary">Checkout now</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
