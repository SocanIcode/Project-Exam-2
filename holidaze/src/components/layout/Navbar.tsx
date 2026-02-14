import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clearAuth, getUser } from "../../utils/auth";

type User = { name: string; venueManager: boolean };

function TitleBar() {
  const { pathname } = useLocation();

  const title = useMemo(() => {
    if (pathname === "/" || pathname === "/explore") return "Venues";
    if (pathname.startsWith("/venue/")) return "Venue";
    if (pathname === "/bookings") return "My bookings";
    if (pathname === "/profile") return "Profile";
    if (pathname === "/manager") return "My venues";
    if (pathname === "/manager/create") return "Create venue";
    if (pathname.includes("/edit")) return "Edit venue";
    if (pathname.includes("/bookings")) return "Bookings";
    if (pathname === "/booking-confirmed") return "Booking confirmed";
    return "";
  }, [pathname]);

  if (!title) return null;

  return (
    <div className="border-b bg-white md:hidden">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <p className="text-sm font-semibold text-[#6A1B7B]">{title}</p>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser<User>();
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "";

  const [open, setOpen] = useState(false);

  function logout() {
    clearAuth();
    setOpen(false);
    navigate("/login", { replace: true });
  }

  // Close menu when route changes (important)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close menu with ESC (accessibility)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const customerLinks = [
    { to: "/", label: "Venues" },
    { to: "/bookings", label: "My bookings" },
    { to: "/profile", label: "Profile" },
  ];

  const managerLinks = [
    { to: "/manager", label: "My venues" },
    { to: "/manager/create", label: "Create venue" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link to="/explore" className="brand">
            <span className="brand__icon">H</span>
            <span className="brand__text">Holidaze</span>
          </Link>

          {/* MOBILE (before login) */}
          {!user && (
            <div className="md:hidden flex items-center gap-3 text-sm">
              <NavLink to="/">Venues</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          )}

          {/* MOBILE (after login) show hamburger only */}
          {user && (
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-2"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              ☰
            </button>
          )}

          {/* DESKTOP */}
          {!user && (
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/">Venues</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          )}

          {user && !user.venueManager && (
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/">Venues</NavLink>
              <NavLink to="/bookings">My bookings</NavLink>
              <NavLink to="/profile">Profile</NavLink>

              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {initials}
              </div>

              <button onClick={logout} className="text-sm underline">
                Logout
              </button>
            </div>
          )}

          {user && user.venueManager && (
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/manager">My venues</NavLink>
              <NavLink to="/manager/create">Create venue</NavLink>
              <NavLink to="/profile">Profile</NavLink>

              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {initials}
              </div>

              <button onClick={logout} className="text-sm underline">
                Logout
              </button>
            </div>
          )}
        </nav>

        {/*  MOBILE dropdown (after login) */}
        {user && open && (
          <div id="mobile-menu" className="md:hidden border-t bg-white">
            <div className="max-w-6xl mx-auto p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                    {initials}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-600">
                      {user.venueManager ? "Venue manager" : "Customer"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>

              <div className="pt-2 border-t flex flex-col gap-2">
                {(user.venueManager ? managerLinks : customerLinks).map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className="py-2 px-2 rounded-lg hover:bg-[#F3D9F7]"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/*  Title under header (mobile only) */}
      <TitleBar />
    </>
  );
}
