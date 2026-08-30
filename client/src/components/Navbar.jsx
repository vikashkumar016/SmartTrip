import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logoutUser } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm">
            ✈
          </div>

          <div>
            <p className="text-lg font-bold leading-none text-slate-900">
              SmartTrip AI
            </p>

            <p className="mt-1 hidden text-xs text-slate-500 sm:block">
              AI Travel Planner
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hidden rounded-lg px-3 py-2 text-sm font-medium transition sm:block ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            Dashboard
          </NavLink>

          {/* User */}
          <div className="hidden border-l border-slate-200 pl-4 md:block">
            <p className="text-xs text-slate-500">
              Signed in as
            </p>

            <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
              {user?.name || "Traveler"}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-4"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;