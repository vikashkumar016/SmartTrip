import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  apiRequest,
} from "../utils/api";


function LoginPage() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();


  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ====================================
  // HANDLE INPUT CHANGE
  // ====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ====================================
  // LOGIN
  // ====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");


      const data =
        await apiRequest(
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


      // Go to dashboard
      navigate("/");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="text-center text-3xl font-bold">
          Welcome Back 👋
        </h1>


        <p className="mt-2 text-center text-slate-500">
          Login to SmartTrip AI
        </p>


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />


          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />


          {/* ERROR */}

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="mt-6 text-center text-slate-500">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-slate-900"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}


export default LoginPage;