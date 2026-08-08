import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Login() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const selectedRole =
    searchParams.get("role") || "employee";

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      // ==============================
      // Check selected portal
      // ==============================

      if (
        data.user.role !==
        selectedRole
      ) {
        throw new Error(
          `This account is not an ${selectedRole} account.`
        );
      }

      // ==============================
      // Save authentication
      // ==============================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ==============================
      // Redirect according to role
      // ==============================

      if (
        data.user.role ===
        "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/employee");
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  const isAdmin =
    selectedRole === "admin";

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-black">
            AI Interview Agent
          </h1>

          <p className="text-slate-400 mt-3">
            Sign in to continue
          </p>

        </div>


        {/* ============================== */}
        {/* Login Form */}
        {/* ============================== */}

        <form
          onSubmit={handleLogin}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
        >

          {/* Role */}

          <div className="text-center mb-6">

            <div
              className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                isAdmin
                  ? "bg-purple-500/10 text-purple-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              {isAdmin
                ? "Admin Portal"
                : "Employee Portal"}
            </div>

          </div>


          <h2 className="text-2xl font-bold mb-2">
            {isAdmin
              ? "Admin Login"
              : "Employee Login"}
          </h2>

          <p className="text-slate-400 text-sm mb-6">
            {isAdmin
              ? "Sign in to manage employees, interviews and meetings."
              : "Sign in to access your interviews, meetings and results."}
          </p>


          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 p-4">
              {error}
            </div>
          )}


          {/* Email */}

          <div className="mb-5">

            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Password */}

          <div className="mb-6">

            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Login */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              isAdmin
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50 py-3 rounded-xl font-semibold transition`}
          >
            {loading
              ? "Signing in..."
              : `Sign In as ${
                  isAdmin
                    ? "Admin"
                    : "Employee"
                }`}
          </button>


          {/* Switch Portal */}

          <button
            type="button"
            onClick={() =>
              navigate(
                isAdmin
                  ? "/login?role=employee"
                  : "/login?role=admin"
              )
            }
            className="w-full mt-4 border border-slate-700 hover:bg-slate-800 py-3 rounded-xl text-sm text-slate-300"
          >
            Switch to{" "}
            {isAdmin
              ? "Employee"
              : "Admin"}{" "}
            Login
          </button>


          {/* Demo accounts */}

          <div className="mt-6 p-4 bg-slate-800 rounded-xl text-sm text-slate-400">

            <p className="font-semibold text-slate-300 mb-2">
              Demo accounts
            </p>

            <p>
              Admin:
              admin@example.com
            </p>

            <p>
              Password:
              admin123
            </p>

            <div className="my-2 border-t border-slate-700" />

            <p>
              Employee:
              employee@example.com
            </p>

            <p>
              Password:
              employee123
            </p>

          </div>

        </form>

      </div>

    </div>
  );
}