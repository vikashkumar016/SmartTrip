import { Link } from "react-router-dom";

function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">

        <div className="w-full">

          {/* Brand */}

          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
              ✈
            </div>

            <div>
              <p className="text-xl font-bold leading-none text-slate-900">
                SmartTrip AI
              </p>

              <p className="mt-1 text-xs text-slate-500">
                AI Travel Planner
              </p>
            </div>
          </Link>


          {/* Auth Card */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                {eyebrow}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                {description}
              </p>

            </div>

            {children}

          </div>


          <p className="mt-6 text-center text-xs text-slate-400">
            Plan smarter. Travel better.
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthLayout;