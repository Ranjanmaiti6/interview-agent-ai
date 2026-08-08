import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
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
      // Redirect according to backend role
      // ========================================

      if (data.user.role === "admin") {
        navigate("/admin");
        return;
      }

      if (data.user.role === "employee") {
        navigate("/employee");
        return;
      }

      throw new Error(
        "Invalid user role."
      );

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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-black">
            AI Interview Agent
          </h1>

          <p className="text-slate-400 mt-3">
            Sign in to continue
          </p>

        </div>


        {/* ================================= */}
        {/* Login Card */}
        {/* ================================= */}

        <form
          onSubmit={handleLogin}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl"
        >

          {/* ================================= */}
          {/* Title */}
          {/* ================================= */}

          <div className="text-center mb-8">

            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold">
              Secure Login
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Welcome Back
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Sign in with your account to continue.
            </p>

          </div>


          {/* ================================= */}
          {/* Error */}
          {/* ================================= */}

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-sm">
              {error}
            </div>
          )}


          {/* ================================= */}
          {/* Email */}
          {/* ================================= */}

          <div className="mb-5">

            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

          </div>


          {/* ================================= */}
          {/* Password */}
          {/* ================================= */}

          <div className="mb-6">

            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

          </div>


          {/* ================================= */}
          {/* Login Button */}
          {/* ================================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>


          {/* ================================= */}
          {/* Demo Accounts */}
          {/* ================================= */}

          <div className="mt-6 p-4 bg-slate-800 rounded-xl text-sm">

            <p className="font-semibold text-slate-300 mb-3">
              Demo Accounts
            </p>

            <div className="space-y-2 text-slate-400">

              <p>
                <span className="text-purple-400 font-semibold">
                  Admin:
                </span>{" "}
                admin@example.com
              </p>

              <p>
                <span className="text-slate-300 font-semibold">
                  Password:
                </span>{" "}
                admin123
              </p>

              <div className="border-t border-slate-700 my-3" />

              <p>
                <span className="text-blue-400 font-semibold">
                  Employee:
                </span>{" "}
                employee@example.com
              </p>

              <p>
                <span className="text-slate-300 font-semibold">
                  Password:
                </span>{" "}
                employee123
              </p>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}