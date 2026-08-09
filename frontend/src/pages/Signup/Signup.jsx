import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password: form.password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to create your account."
        );
      }

      /*
       * If your backend returns a token immediately,
       * save it and redirect the user.
       */
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email,
            role: "employee",
          })
        );
      }

      setSuccess(
        "Account created successfully. Redirecting..."
      );

      setTimeout(() => {
        navigate("/employee");
      }, 800);
    } catch (signupError) {
      console.error("Signup error:", signupError);

      /*
       * If your backend is not connected yet,
       * this message makes the problem clear.
       */
      setError(
        signupError.message ||
          "Something went wrong while creating your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06080c] text-white">
      {/* Ambient background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[150px]" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.035] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      {/* Top line */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* Navbar */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#06080c]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/[0.07]">
              <BrainCircuit
                size={20}
                className="text-blue-300"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-300/65">
                AI Interview
              </p>

              <p className="mt-0.5 text-sm font-semibold">
                Interview Platform
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />

            <span className="hidden sm:inline">
              Back to Home
            </span>
          </Link>
        </div>
      </header>

      {/* Main */}

      <main className="relative z-10 flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
          {/* Left content */}

          <section className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/10 bg-blue-400/[0.04] px-3 py-1.5">
              <CheckCircle2
                size={12}
                className="text-blue-300"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300/65">
                Create your account
              </span>
            </div>

            <h1 className="mt-7 max-w-2xl text-6xl font-semibold leading-[0.95] tracking-[-0.06em]">
              Start building
              <span className="text-white/35">
                {" "}
                better interviews.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/35">
              Create your account to access the AI
              interview platform, manage interviews,
              review candidates, and track assessment
              results.
            </p>

            <div className="mt-9 space-y-4">
              <SignupFeature
                title="AI-powered interviews"
                text="Run structured technical and behavioral assessments."
              />

              <SignupFeature
                title="Candidate management"
                text="Organize candidates and interview sessions from one place."
              />

              <SignupFeature
                title="Interview reports"
                text="Review responses and evaluation results securely."
              />
            </div>
          </section>

          {/* Signup card */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/[0.07] blur-[90px]" />

            <div className="relative">
              {/* Header */}

              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/[0.07]">
                  <BrainCircuit
                    size={28}
                    strokeWidth={1.3}
                    className="text-blue-300"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">
                  Create account
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/30">
                  Join the AI interview platform.
                </p>
              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Name */}

                <InputField
                  label="Full name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  icon={User}
                />

                {/* Email */}

                <InputField
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  icon={Mail}
                />

                {/* Password */}

                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  visible={showPassword}
                  onToggle={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                />

                {/* Confirm password */}

                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  visible={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                />

                {/* Error */}

                {error && (
                  <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-xs leading-5 text-red-300/80">
                    {error}
                  </div>
                )}

                {/* Success */}

                {success && (
                  <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3 text-xs leading-5 text-emerald-300/80">
                    {success}
                  </div>
                )}

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_18px_50px_rgba(37,99,235,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </form>

              {/* Login */}

              <div className="mt-7 text-center">
                <p className="text-xs text-white/25">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-300/75 transition hover:text-blue-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Security */}

              <div className="mt-6 flex items-center justify-center gap-2">
                <Lock
                  size={12}
                  className="text-white/20"
                />

                <span className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Secure authenticated account
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   Input
========================================== */

function InputField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
        />

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={
            name === "email"
              ? "email"
              : "name"
          }
          className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-blue-400/25 focus:bg-blue-400/[0.018] focus:ring-4 focus:ring-blue-500/[0.04]"
        />
      </div>
    </div>
  );
}

/* ==========================================
   Password
========================================== */

function PasswordField({
  label,
  name,
  placeholder,
  value,
  onChange,
  visible,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
        />

        <input
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={
            name === "password"
              ? "new-password"
              : "new-password"
          }
          className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-blue-400/25 focus:bg-blue-400/[0.018] focus:ring-4 focus:ring-blue-500/[0.04]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.04] hover:text-white/60"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   Signup feature
========================================== */

function SignupFeature({
  title,
  text,
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
        <CheckCircle2
          size={16}
          className="text-emerald-300/70"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-white/70">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/25">
          {text}
        </p>
      </div>
    </div>
  );
}