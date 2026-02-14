import { NavLink } from "react-router-dom";
import { getUser } from "../../utils/auth";

type User = { venueManager: boolean };

function itemClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-[#6A1B7B] font-semibold"
    : "text-gray-700 hover:text-[#6A1B7B]";
}

export default function MobileBottomNav() {
  const user = getUser<User>();
  if (!user) return null;

  const items = user.venueManager
    ? [
        { to: "/manager", label: "My venues" },
        { to: "/manager/create", label: "Create" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/", label: "Venues" },
        { to: "/bookings", label: "My booking" },
        { to: "/profile", label: "Profile" },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-around">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} className={itemClass}>
            <span className="text-xs">{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
