import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";

function RegisterPage() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
  // REGISTER
  // ====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/auth/register",
        {
          method: "POST",

          body: JSON.stringify(
            formData
          ),
        }
      );

      // Registration response already
      // contains user + JWT
      loginUser(
        data.user,
        data.token
      );

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "We couldn't create your account. Please check your details and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Start your journey"
      title="Create your account"
      description="Create an account and start planning smarter trips with AI."
    >

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        {/* NAME */}

        <div>

          <label
            htmlFor="name"
            className="text-sm font-semibold text-slate-800"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            required
          />

        </div>


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

          <div className="flex items-center justify-between">

            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-800"
            >
              Password
            </label>

            <span className="text-xs text-slate-400">
              Minimum 6 characters
            </span>

          </div>


          <div className="relative">

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClass} pr-20`}
              minLength={6}
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


        {/* REGISTER */}

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
            ? "Creating your account..."
            : "Create Account"}

        </button>

      </form>


      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{" "}

        <Link
          to="/login"
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>

    </AuthLayout>
  );
}

export default RegisterPage;