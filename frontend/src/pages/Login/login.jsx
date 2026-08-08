import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

export default function Login() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const requestedRole =
    searchParams.get("role");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

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
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Login failed. Server returned ${response.status}.`
        );
      }

      if (!data.user || !data.token) {
        throw new Error(
          "Login succeeded, but the server returned invalid authentication data."
        );
      }

      // ========================================
      // Validate requested role
      // ========================================

      if (
        requestedRole &&
        !["admin", "employee"].includes(
          requestedRole
        )
      ) {
        throw new Error(
          "Invalid login role."
        );
      }

      if (
        requestedRole &&
        data.user.role !== requestedRole
      ) {
        throw new Error(
          `This account does not have ${requestedRole} access.`
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
      // Redirect
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
        "Invalid user role returned by the server."
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isAdmin =
    requestedRole === "admin";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">

      {/* ====================================== */}
      {/* Ambient background */}
      {/* ====================================== */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-blue-500/[0.055] blur-[160px]" />

        <div className="absolute right-[-15%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[160px]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.025] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 78%)",
          }}
        />

      </div>

      {/* Top line */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ====================================== */}
      {/* Back button */}
      {/* ====================================== */}

      <button
        type="button"
        onClick={() => navigate("/")}
        className="group absolute left-6 top-6 z-30 inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/40 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />

        Back to home
      </button>

      {/* ====================================== */}
      {/* Main */}
      {/* ====================================== */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-24">

        <div className="w-full max-w-[460px]">

          {/* ================================== */}
          {/* Brand */}
          {/* ================================== */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/[0.07] shadow-[0_0_60px_rgba(59,130,246,0.12)]">

              <BrainCircuit
                size={30}
                strokeWidth={1.35}
                className="text-blue-300"
              />

            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
              AI Interview Agent
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              {isAdmin
                ? "Admin access."
                : requestedRole ===
                  "employee"
                ? "Welcome back."
                : "Sign in."}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/35">
              {isAdmin
                ? "Access the interview intelligence and recruitment control system."
                : "Continue to your personalized AI interview workspace."}
            </p>

          </div>

          {/* ================================== */}
          {/* Login card */}
          {/* ================================== */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">

            {/* Card glow */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[80px]" />

            <div className="relative">

              {/* Security badge */}

              <div className="mb-7 flex items-center justify-between">

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.05] px-3 py-1.5">

                  <Sparkles
                    size={12}
                    className="text-blue-300"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300/80">
                    Secure authentication
                  </span>

                </div>

                <ShieldCheck
                  size={17}
                  className="text-emerald-300/40"
                />

              </div>

              {/* Error */}

              {error && (
                <div className="mb-6 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4">

                  <p className="text-xs font-semibold text-red-300">
                    Authentication failed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-300/60">
                    {error}
                  </p>

                </div>
              )}

              {/* ================================= */}
              {/* Form */}
              {/* ================================= */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35"
                  >
                    Email address
                  </label>

                  <div className="group relative">

                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors duration-300 group-focus-within:text-blue-300/70"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="h-14 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/30 focus:bg-blue-500/[0.025] focus:ring-4 focus:ring-blue-500/[0.06]"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35"
                  >
                    Password
                  </label>

                  <div className="group relative">

                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors duration-300 group-focus-within:text-blue-300/70"
                    />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-14 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/30 focus:bg-blue-500/[0.025] focus:ring-4 focus:ring-blue-500/[0.06]"
                    />

                  </div>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-blue-500 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_18px_45px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >

                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* ================================= */}
              {/* Demo credentials */}
              {/* ================================= */}

              <div className="mt-7 border-t border-white/[0.06] pt-6">

                <div className="flex items-center justify-between">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/20">
                    Development access
                  </p>

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">

                  <div className="rounded-xl border border-white/[0.05] bg-black/15 p-3">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-purple-300/60">
                      Admin
                    </p>

                    <p className="mt-2 truncate text-xs text-white/40">
                      admin@example.com
                    </p>

                    <p className="mt-1 text-[10px] text-white/20">
                      admin123
                    </p>

                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-black/15 p-3">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300/60">
                      Employee
                    </p>

                    <p className="mt-2 truncate text-xs text-white/40">
                      employee@example.com
                    </p>

                    <p className="mt-1 text-[10px] text-white/20">
                      employee123
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================================== */}
          {/* Footer */}
          {/* ================================== */}

          <div className="mt-7 flex items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/15">

            <span className="h-px w-10 bg-white/[0.07]" />

            Context-aware authentication

            <span className="h-px w-10 bg-white/[0.07]" />

          </div>

        </div>

      </main>

      {/* Bottom status */}

      <div className="pointer-events-none fixed bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/10 sm:flex">

        <span className="h-px w-8 bg-white/[0.07]" />

        AI Interview Agent

        <span className="h-px w-8 bg-white/[0.07]" />

      </div>

    </div>
  );
}