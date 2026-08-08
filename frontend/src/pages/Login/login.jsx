import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

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
            "Content-Type": "application/json",
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

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030508] text-white">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Blue glow */}

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.12] blur-[140px]" />

        {/* Purple glow */}

        <div className="absolute -right-40 top-[15%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.10] blur-[150px]" />

        {/* Cyan glow */}

        <div className="absolute bottom-[-250px] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[150px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize:
              "50px 50px",
          }}
        />

        {/* Radial vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,5,8,0.75)_80%)]" />

      </div>


      {/* ================================================= */}
      {/* TOP LINE */}
      {/* ================================================= */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">

        <div className="w-full max-w-6xl">

          {/* ================================================= */}
          {/* BRAND */}
          {/* ================================================= */}

          <div className="mb-8 flex items-center justify-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] shadow-[0_0_40px_rgba(59,130,246,0.12)]">

              <BrainCircuit
                size={22}
                className="text-blue-300"
                strokeWidth={1.5}
              />

              <div className="absolute inset-0 rounded-2xl bg-blue-400/10 blur-xl" />

            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                AI Platform
              </p>

              <h1 className="text-lg font-semibold tracking-tight">
                AI Interview Agent
              </h1>

            </div>

          </div>


          {/* ================================================= */}
          {/* LOGIN CONTAINER */}
          {/* ================================================= */}

          <div className="grid overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">


            {/* ================================================= */}
            {/* LEFT PANEL */}
            {/* ================================================= */}

            <div className="relative hidden overflow-hidden border-r border-white/[0.07] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">

              {/* Decorative sphere */}

              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[330px] w-[330px] rounded-full border border-blue-400/[0.08] bg-gradient-to-br from-blue-500/[0.08] to-transparent shadow-[inset_-30px_-30px_80px_rgba(59,130,246,0.06)]" />

              <div className="pointer-events-none absolute right-[-40px] top-[-40px] h-[210px] w-[210px] rounded-full border border-white/[0.04]" />

              <div className="relative z-10">

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.06] px-3 py-1.5">

                  <Sparkles
                    size={13}
                    className="text-blue-300"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">
                    Intelligent Hiring
                  </span>

                </div>

                <h2 className="mt-8 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-5xl">

                  Interview smarter.
                  <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                    Hire better.
                  </span>

                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-white/35">
                  An intelligent interview platform designed
                  to evaluate technical skills, communication,
                  problem solving, and overall candidate
                  performance.
                </p>

              </div>


              {/* Feature cards */}

              <div className="relative z-10 mt-12 space-y-3">

                <Feature
                  icon={BrainCircuit}
                  title="AI-Powered Interviews"
                  description="Adaptive technical questioning"
                />

                <Feature
                  icon={ShieldCheck}
                  title="Secure Evaluation"
                  description="Protected interview workflow"
                />

                <Feature
                  icon={Sparkles}
                  title="Intelligent Reports"
                  description="Personalized performance insights"
                />

              </div>


              {/* Bottom decoration */}

              <div className="relative z-10 mt-10 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/20">

                <span className="h-px w-8 bg-blue-400/40" />

                Intelligent Interview Infrastructure

              </div>

            </div>


            {/* ================================================= */}
            {/* RIGHT LOGIN */}
            {/* ================================================= */}

            <div className="relative p-7 sm:p-10 xl:p-14">

              {/* Small top indicator */}

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-blue-400">
                    Secure Access
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    Welcome back.
                  </h2>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                  <LockKeyhole
                    size={17}
                    className="text-white/35"
                  />
                </div>

              </div>


              <p className="mb-8 text-sm leading-6 text-white/30">
                Sign in to access your interview
                workspace and continue where you left off.
              </p>


              {/* ================================================= */}
              {/* ERROR */}
              {/* ================================================= */}

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


              {/* ================================================= */}
              {/* FORM */}
              {/* ================================================= */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/35"
                  >
                    Email Address
                  </label>

                  <div className="group relative">

                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-blue-300"
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
                      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/15 focus:border-blue-400/40 focus:bg-blue-400/[0.025] focus:ring-4 focus:ring-blue-500/[0.06]"
                    />

                  </div>

                </div>


                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/35"
                  >
                    Password
                  </label>

                  <div className="group relative">

                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-blue-300"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/15 focus:border-blue-400/40 focus:bg-blue-400/[0.025] focus:ring-4 focus:ring-blue-500/[0.06]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white/60"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>


                {/* Login */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-3 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_18px_45px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">
                    {loading
                      ? "Authenticating..."
                      : "Sign In"}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="relative transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}

                </button>

              </form>


              {/* ================================================= */}
              {/* SECURITY */}
              {/* ================================================= */}

              <div className="mt-7 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">

                <ShieldCheck size={13} />

                Secure authenticated session

              </div>


              {/* ================================================= */}
              {/* DEMO ACCOUNTS */}
              {/* ================================================= */}

              <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">

                <div className="flex items-center justify-between">

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Demo Access
                  </p>

                  <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-emerald-300/70">
                    Development
                  </span>

                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <DemoAccount
                    role="Admin"
                    email="admin@example.com"
                    password="admin123"
                  />

                  <DemoAccount
                    role="Employee"
                    email="employee@example.com"
                    password="employee123"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <p className="mt-6 text-center text-[9px] font-medium uppercase tracking-[0.22em] text-white/15">
            AI Interview Agent • Secure Interview Infrastructure
          </p>

        </div>

      </main>

    </div>
  );
}


// =====================================================
// FEATURE
// =====================================================

function Feature({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4 transition-all duration-300 hover:border-blue-400/15 hover:bg-blue-400/[0.025]">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">

        <Icon
          size={17}
          strokeWidth={1.5}
          className="text-blue-300/70 transition-colors group-hover:text-blue-300"
        />

      </div>

      <div>

        <p className="text-sm font-semibold text-white/75">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-white/25">
          {description}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// DEMO ACCOUNT
// =====================================================

function DemoAccount({
  role,
  email,
  password,
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/10 p-3">

      <div className="flex items-center justify-between">

        <p className="text-[10px] font-semibold text-white/50">
          {role}
        </p>

        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />

      </div>

      <p className="mt-2 truncate text-[10px] text-white/25">
        {email}
      </p>

      <p className="mt-1 text-[10px] text-white/20">
        Password: {password}
      </p>

    </div>
  );
}