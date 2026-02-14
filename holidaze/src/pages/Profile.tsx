import { useEffect, useMemo, useState } from "react";
import { getUser, setAuth } from "../utils/auth";
import { updateProfile } from "../api/profile";
import { ProfileTabs } from "../components/ui/ProfileTabs";

import type { Booking } from "../types/booking";
import { getMyBookings } from "../api/bookings";
import { getProfileBookings } from "../api/manager";
import { isUpcoming, isPast } from "../utils/bookingBuckets";
import { useLocation } from "react-router-dom";

type TabId = "current" | "past";

type AuthUser = {
  name: string;
  email: string;
  venueManager: boolean;
  accessToken: string;
  avatar?: { url?: string; alt?: string };
  banner?: { url?: string; alt?: string };
};

export default function Profile() {
  const user = getUser<AuthUser>();

  const [tab, setTab] = useState<TabId>("current");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerAlt, setBannerAlt] = useState("");

  // init inputs
  useEffect(() => {
    if (!user) return;
    setAvatarUrl(user.avatar?.url ?? "");
    setAvatarAlt(user.avatar?.alt ?? user.name);
    setBannerUrl(user.banner?.url ?? "");
    setBannerAlt(user.banner?.alt ?? `${user.name} banner`);
  }, [user?.name]);

  const location = useLocation();
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoadingBookings(true);
        setBookingsError(null);

        const data = user.venueManager
          ? await getProfileBookings(user.name)
          : await getMyBookings();

        setBookings(data ?? []);
      } catch (e) {
        setBookingsError(
          e instanceof Error ? e.message : "Failed to load bookings",
        );
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [user?.name, user?.venueManager, location.key]);

  const tabs = useMemo(() => {
    if (!user) return [];
    return user.venueManager
      ? [
          { id: "current" as const, label: "Current bookings" },
          { id: "past" as const, label: "Past bookings" },
        ]
      : [
          { id: "current" as const, label: "Upcoming trips" },
          { id: "past" as const, label: "Past trips" },
        ];
  }, [user]);

  const filtered = useMemo(() => {
    return tab === "current"
      ? bookings.filter((b) => isUpcoming(b.dateFrom, b.dateTo))
      : bookings.filter((b) => isPast(b.dateTo));
  }, [bookings, tab]);

  function looksLikeUrl(v: string) {
    return !v || /^https?:\/\/.+/i.test(v);
  }

  async function onSave() {
    if (!user) return;

    setErr(null);
    setMsg(null);

    if (!looksLikeUrl(avatarUrl))
      return setErr("Avatar URL must start with http(s)://");
    if (!looksLikeUrl(bannerUrl))
      return setErr("Banner URL must start with http(s)://");

    try {
      setSaving(true);

      const payload = {
        avatar: avatarUrl
          ? { url: avatarUrl, alt: avatarAlt.trim() || undefined }
          : undefined,
        banner: bannerUrl
          ? { url: bannerUrl, alt: bannerAlt.trim() || undefined }
          : undefined,
      };

      const updated = await updateProfile(user.name, payload);

      setAuth({
        ...user,
        avatar: updated?.avatar ?? payload.avatar ?? undefined,
        banner: updated?.banner ?? payload.banner ?? undefined,
      });

      setMsg("Profile updated!");
      setEditing(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <p className="p-4">You must be logged in</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden border bg-white">
        <div className="h-44 w-full bg-gray-100">
          <img
            src={
              user.banner?.url || bannerUrl || "https://placehold.co/1200x300"
            }
            alt={user.banner?.alt || "Banner"}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-4 flex items-center gap-4">
          <img
            src={user.avatar?.url || avatarUrl || "https://placehold.co/96x96"}
            alt={user.avatar?.alt || user.name}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div className="flex-1">
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm">
              Role: {user.venueManager ? "Venue Manager" : "Customer"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setErr(null);
              setMsg(null);
              setEditing((v) => !v);
            }}
            className="btn-secondar"
          >
            {editing ? "Close" : "Edit profile"}
          </button>
        </div>

        {/* Edit panel */}
        {editing && (
          <div className="p-4 border-t space-y-3">
            {err && <p className="text-sm text-red-600">{err}</p>}
            {msg && <p className="text-sm text-green-700">{msg}</p>}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium">Avatar URL</span>
                <input
                  className="rounded-xl border p-2"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium">Avatar alt</span>
                <input
                  className="rounded-xl border p-2"
                  value={avatarAlt}
                  onChange={(e) => setAvatarAlt(e.target.value)}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium">Banner URL</span>
                <input
                  className="rounded-xl border p-2"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium">Banner alt</span>
                <input
                  className="rounded-xl border p-2"
                  value={bannerAlt}
                  onChange={(e) => setBannerAlt(e.target.value)}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="btn-secondary"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Bookings */}
      <div className="rounded-2xl border bg-white p-4 space-y-4">
        {loadingBookings && <p className="text-sm">Loading…</p>}

        {bookingsError && (
          <p className="text-sm text-red-600">{bookingsError}</p>
        )}

        {!loadingBookings && !bookingsError && filtered.length === 0 && (
          <p className="text-sm text-gray-600 py-6 text-center">
            {tab === "current"
              ? user.venueManager
                ? "No current bookings yet."
                : "No upcoming trips yet."
              : user.venueManager
                ? "No past bookings yet."
                : "No past trips yet."}
          </p>
        )}

        {!loadingBookings && !bookingsError && filtered.length > 0 && (
          <div className="grid gap-4">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-2xl border p-4">
                <div className="flex gap-4">
                  <img
                    src={
                      b.venue?.media?.[0]?.url ?? "https://placehold.co/96x96"
                    }
                    alt={b.venue?.media?.[0]?.alt ?? b.venue?.name ?? "Venue"}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{b.venue?.name ?? "Venue"}</p>
                    <p className="text-sm text-gray-600">
                      {b.dateFrom.slice(0, 10)} → {b.dateTo.slice(0, 10)}
                    </p>
                    <p className="text-sm text-gray-600">{b.guests} guests</p>

                    {user.venueManager && b.customer && (
                      <p className="text-sm text-gray-600">
                        Customer: {b.customer.name} ({b.customer.email})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
