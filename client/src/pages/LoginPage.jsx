import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";

function LoginPage() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  // ====================================
  // INPUT CHANGE
  // ====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ====================================
  // LOGIN
  // ====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/auth/login",
        {
          method: "POST",

          body: JSON.stringify(
            formData
          ),
        }
      );

      // Save user + JWT
      loginUser(
        data.user,
        data.token
      );

      // Dashboard
      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "We couldn't sign you in. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to SmartTrip"
      description="Continue planning personalized trips, itineraries, budgets, weather, and more."
    >

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        {/* EMAIL */}

        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold text-slate-800"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>


        {/* PASSWORD */}

        <div>

          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-800"
          >
            Password
          </label>

          <div className="relative">

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClass} pr-20`}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}


        {/* LOGIN */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden="true"
            />
          )}

          {loading
            ? "Signing you in..."
            : "Sign In"}

        </button>

      </form>


      <p className="mt-7 text-center text-sm text-slate-500">
        Don't have an account?{" "}

        <Link
          to="/register"
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Create an account
        </Link>
      </p>

    </AuthLayout>
  );
}

export default LoginPage;