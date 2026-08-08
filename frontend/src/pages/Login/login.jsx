import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // Login
  // ==========================================

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

      // ========================================
      // Save authentication
      // ========================================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ========================================
      // Redirect according to actual user role
      // ========================================

      if (
        data.user.role ===
        "admin"
      ) {
        navigate("/admin");
      } else if (
        data.user.role ===
        "employee"
      ) {
        navigate("/employee");
      } else {
        throw new Error(
          "Invalid user role."
        );
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

  return (
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

        <h2 className="text-2xl font-bold mb-2">
          Login
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          Sign in with your Admin or
          Employee account.
        </p>


        {/* ============================== */}
        {/* Error */}
        {/* ============================== */}

        {error && (
          <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 p-4">
            {error}
          </div>
        )}


        {/* ============================== */}
        {/* Email */}
        {/* ============================== */}

        <div className="mb-5">

          <label className="block text-sm text-slate-300 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Enter your email"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>


        {/* ============================== */}
        {/* Password */}
        {/* ============================== */}

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


        {/* ============================== */}
        {/* Login Button */}
        {/* ============================== */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
        >
          {loading
            ? "Signing in..."
            : "Sign In"}
        </button>


        {/* ============================== */}
        {/* Information */}
        {/* ============================== */}

        <div className="mt-6 p-4 bg-slate-800 rounded-xl text-sm text-slate-400">

          <p className="font-semibold text-slate-300 mb-2">
            Login Information
          </p>

          <p>
            Use your registered Admin
            or Employee credentials.
          </p>

          <p className="mt-2 text-slate-500">
            You will automatically be
            redirected to the correct
            dashboard according to your
            account role.
          </p>

        </div>


        {/* ============================== */}
        {/* Demo accounts */}
        {/* ============================== */}

        <div className="mt-4 p-4 bg-slate-800 rounded-xl text-sm text-slate-400">

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
  );
}