import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export default function Candidate() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Load candidates
  // ==========================================

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const API_URL = (
          import.meta.env.VITE_API_URL ||
          "http://localhost:5001"
        ).replace(/\/$/, "");

        const response = await fetch(
          `${API_URL}/api/employee/candidates`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load candidates."
          );
        }

        setCandidates(data.candidates || []);
      } catch (error) {
        console.error(
          "Candidate loading error:",
          error
        );

        setError(
          error.message ||
            "Unable to load candidates."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  // ==========================================
  // Open candidate dashboard
  // ==========================================

  const startInterview = (id) => {
    navigate(`/candidate/${id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">

      {/* ========================================= */}
      {/* Ambient background */}
      {/* ========================================= */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[15%] top-[-15%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.055] blur-[150px]" />

        <div className="absolute right-[-10%] top-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.025] blur-[140px]" />

        <div className="absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.025] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      {/* ========================================= */}
      {/* Top line */}
      {/* ========================================= */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* ========================================= */}
      {/* Main */}
      {/* ========================================= */}

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

        {/* ======================================= */}
        {/* Header */}
        {/* ======================================= */}

        <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-10 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                Candidate Intelligence
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">
              Select candidate.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/40">
              Review each candidate's learning journey before entering
              their adaptive AI interview.
            </p>
          </div>

          {/* System status */}

          <div className="flex items-center gap-3 self-start rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 lg:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Interview system operational
            </span>
          </div>
        </div>

        {/* ======================================= */}
        {/* Overview strip */}
        {/* ======================================= */}

        <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">

          <div className="bg-[#080b10]/90 p-5">
            <div className="flex items-center gap-3">
              <Users
                size={16}
                className="text-blue-300/70"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Candidates
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold text-white">
              {candidates.length}
            </p>
          </div>

          <div className="bg-[#080b10]/90 p-5">
            <div className="flex items-center gap-3">
              <BrainCircuit
                size={16}
                className="text-blue-300/70"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                AI assessment
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-white/75">
              Adaptive technical interview
            </p>
          </div>

          <div className="bg-[#080b10]/90 p-5">
            <div className="flex items-center gap-3">
              <Sparkles
                size={16}
                className="text-blue-300/70"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Evaluation
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-white/75">
              Context-aware results
            </p>
          </div>
        </div>

        {/* ======================================= */}
        {/* Loading */}
        {/* ======================================= */}

        {loading && (
          <div className="mt-8 rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

            <p className="mt-4 text-sm text-white/40">
              Loading candidates...
            </p>
          </div>
        )}

        {/* ======================================= */}
        {/* Error */}
        {/* ======================================= */}

        {!loading && error && (
          <div className="mt-8 rounded-[26px] border border-red-400/10 bg-red-400/[0.03] p-8">
            <p className="text-sm font-semibold text-red-300">
              Unable to load candidates
            </p>

            <p className="mt-2 text-xs text-white/35">
              {error}
            </p>
          </div>
        )}

        {/* ======================================= */}
        {/* Empty state */}
        {/* ======================================= */}

        {!loading &&
          !error &&
          candidates.length === 0 && (
            <div className="mt-8 rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-10 text-center">
              <Users
                size={30}
                className="mx-auto text-white/20"
              />

              <p className="mt-5 text-sm font-semibold text-white/60">
                No candidates found
              </p>

              <p className="mt-2 text-xs text-white/25">
                New employee accounts will appear here automatically.
              </p>
            </div>
          )}

        {/* ======================================= */}
        {/* Candidate cards */}
        {/* ======================================= */}

        {!loading &&
          !error &&
          candidates.length > 0 && (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">

              {candidates.map((candidate) => {
                const completed =
                  Number(candidate.completed) || 0;

                const total =
                  Number(candidate.total) || 31;

                const progress =
                  total > 0
                    ? Math.min(
                        100,
                        (completed / total) * 100
                      )
                    : 0;

                const isReady =
                  candidate.status ===
                  "Interview ready";

                return (
                  <article
                    key={candidate.id}
                    className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.018] shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/[0.18] hover:bg-white/[0.025]"
                  >

                    {/* Hover glow */}

                    <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-blue-500/[0.08] opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-100" />

                    {/* Top accent */}

                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/0 to-transparent transition-all duration-700 group-hover:via-blue-400/40" />

                    <div className="relative p-7 sm:p-8">

                      {/* Card top */}

                      <div className="flex items-start justify-between gap-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-500/[0.07] shadow-[0_0_35px_rgba(59,130,246,0.08)]">
                            <span className="text-lg font-semibold tracking-tight text-blue-200">
                              {candidate.name
                                ?.split(" ")
                                .map(
                                  (part) =>
                                    part[0]
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>

                          <div>

                            <div className="flex items-center gap-2">

                              <h2 className="text-xl font-semibold tracking-[-0.025em] text-white">
                                {candidate.name}
                              </h2>

                              {isReady && (
                                <CheckCircle2
                                  size={15}
                                  className="text-emerald-400"
                                />
                              )}

                            </div>

                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                              Candidate #
                              {String(
                                candidate.id
                              ).slice(-6)}
                            </p>

                          </div>
                        </div>

                        <span
                          className={`hidden rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] sm:inline-flex ${
                            isReady
                              ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300/70"
                              : "border-blue-400/15 bg-blue-400/[0.05] text-blue-300/70"
                          }`}
                        >
                          {candidate.status}
                        </span>

                      </div>

                      {/* Email */}

                      {candidate.email && (
                        <p className="mt-5 text-xs text-white/30">
                          {candidate.email}
                        </p>
                      )}

                      {/* Skills */}

                      <div className="mt-7">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                          Core strengths
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {(candidate.skills ||
                            "AI Interview Candidate")
                            .split(",")
                            .map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-white/55"
                              >
                                {skill.trim()}
                              </span>
                            ))}

                        </div>
                      </div>

                      {/* Learning progress */}

                      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-black/20 p-5">

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-2">

                            <Target
                              size={14}
                              className="text-blue-300/70"
                            />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                              Learning progress
                            </span>

                          </div>

                          <span className="font-mono text-xs text-white/45">
                            {Math.round(
                              progress
                            )}
                            %
                          </span>

                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 transition-all duration-700"
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                          <span className="flex items-center gap-2 text-[10px] text-white/25">
                            <Clock3 size={12} />

                            {completed} / {total} days
                          </span>

                          <span className="text-[10px] text-white/25">
                            {candidate.progress}
                          </span>

                        </div>
                      </div>

                      {/* Candidate dashboard CTA */}

                      <button
                        type="button"
                        onClick={() =>
                          startInterview(
                            candidate.id
                          )
                        }
                        className="group/button relative mt-7 flex w-full items-center justify-between overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/[0.08] px-5 py-4 text-left transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/[0.14]"
                      >

                        <div className="relative z-10">

                          <p className="text-sm font-semibold text-white">
                            View candidate dashboard
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/25">
                            Review profile & interview readiness
                          </p>

                        </div>

                        <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">

                          <ArrowUpRight
                            size={16}
                            className="text-blue-300 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                          />

                        </div>

                        <span className="absolute inset-0 -translate-x-full bg-white/[0.035] skew-x-[-20deg] transition-transform duration-500 group-hover/button:translate-x-full" />

                      </button>

                    </div>

                    {/* Bottom metadata */}

                    <div className="flex items-center justify-between border-t border-white/[0.06] px-7 py-4 sm:px-8">

                      <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">

                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400/70" />

                        Adaptive AI
                      </span>

                      <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-white/20 transition-colors group-hover:text-white/40">
                        Open profile
                        <ChevronRight size={12} />
                      </span>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        {/* ======================================= */}
        {/* Bottom system note */}
        {/* ======================================= */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs leading-6 text-white/25">
            Candidate context is used to personalize the technical
            interview and generate relevant follow-up questions.
          </p>

          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">

            <span className="h-px w-8 bg-white/[0.08]" />

            Candidate intelligence

            <span className="h-px w-8 bg-white/[0.08]" />

          </div>

        </div>

      </main>
    </div>
  );
}