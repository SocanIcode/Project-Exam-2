import { Link, useLocation } from "react-router-dom";
import { getUser } from "../../utils/auth";

type User = { name: string; venueManager: boolean };

export default function Footer() {
  const user = getUser<User>();
  const { pathname } = useLocation();

  // ✅ Mobile footer only before login and only on homepage
  const showMobileFooter =
    !user && (pathname === "/" || pathname === "/explore");

  return (
    <footer className="border-t bg-white">
      {/* ✅ Desktop footer: always visible */}
      <div className="hidden md:block">
        <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <p className="font-semibold text-[#6A1B7B]">Holidaze</p>
            <p className="text-sm text-gray-600">
              Find venues, book trips, and manage stays easily.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">Support</p>
            <p className="text-sm text-gray-600">Email: support@holidaze.com</p>
            <p className="text-sm text-gray-600">Stockholm, Sweden</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-4 text-xs  text-[#6A1B7B] align-middle">
          © {new Date().getFullYear()} Holidaze. All rights reserved.
        </div>
      </div>

      {/* ✅ Mobile footer: only before login on home */}
      {showMobileFooter && (
        <div className="md:hidden">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center space-y-2">
            <p className="font-semibold text-[#6A1B7B]">Holidaze</p>
            <p className="text-sm text-gray-600">
              Discover venues and book your stay.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link to="/login" className="underline">
                Login
              </Link>
              <Link to="/register" className="underline">
                Register
              </Link>
            </div>
            <p className="text-xs text-[#6A1B7B]">
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
