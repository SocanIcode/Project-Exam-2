import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Venue } from "../types/venue";

type State = {
  venue: Venue;
  bookingId?: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  nights: number;
  total: number;
};

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state as State | null;

  // If user refreshes, router state is lost
  if (!data) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-3">
        <p className="text-sm text-gray-700">
          No booking details found. Please make a booking again.
        </p>
        <Link to="/explore" className="text-pink-600 underline">
          Back to search
        </Link>
      </div>
    );
  }

  const { venue, dateFrom, dateTo, guests, nights, total } = data;

  const city = venue.location?.city ?? "City not provided";
  const country = venue.location?.country ?? "";
  const address = venue.location?.address ?? "Address not provided";

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-green-700 text-xl font-semibold">
        Booking Confirmed
      </h1>

      <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{venue.name}</h2>
          <p className="text-sm text-gray-600">
            {city}
            {country ? `, ${country}` : ""}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 text-sm space-y-1">
          <p className="font-semibold">Dates</p>
          <p>
            {dateFrom} → {dateTo} ({nights} night{nights !== 1 ? "s" : ""})
          </p>
          <p className="text-gray-600">Guests: {guests}</p>
        </div>

        <div className="text-sm space-y-1">
          <p className="font-semibold">Property Address</p>
          <p className="text-gray-700">{address}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm font-semibold">Total Price</p>
          <p className="text-lg font-bold text-pink-600">{total} kr</p>
        </div>

        <div className="  btn-secondary">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-1/2 rounded-xl border px-4 py-3 font-semibold"
          >
            Manage Booking
          </button>

          <Link
            to={`/venue/${venue.id}`}
            className="btn-secondary    hover:bg-[#9C275F]"
          >
            View Venue
          </Link>
        </div>
      </div>
    </div>
  );
}
