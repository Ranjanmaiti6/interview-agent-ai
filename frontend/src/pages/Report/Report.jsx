import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  BrainCircuit,
  BarChart3,
  Sparkles,
  Target,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import ScoreCard from "../../components/report/ScoreCard";
import Recommendation from "../../components/report/Recommendation";

export default function Report() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // Candidate
  // ==========================================

  const candidateName =
    state?.candidateName || "Candidate";

  // ==========================================
  // All interview scores
  // ==========================================

  const allScores =
    state?.allScores?.length > 0
      ? state.allScores
      : [
          state?.score || {
            technical: 0,
            communication: 0,
            problemSolving: 0,
          },
        ];

  // ==========================================
  // Calculate average score
  // ==========================================

  const calculateAverage = (field) => {
    if (!allScores.length) {
      return 0;
    }

    const total = allScores.reduce(
      (sum, item) => {
        return sum + Number(item?.[field] || 0);
      },
      0
    );

    return Math.round(total / allScores.length);
  };

  // ==========================================
  // Average category scores
  // ==========================================

  const technical = calculateAverage("technical");

  const communication =
    calculateAverage("communication");

  const problemSolving =
    calculateAverage("problemSolving");

  // ==========================================
  // Overall score
  // ==========================================

  const overall = Math.round(
    ((technical + communication + problemSolving) / 3) * 10
  );

  // ==========================================
  // Strengths
  // ==========================================

  const strengths =
    state?.strengths?.length > 0
      ? state.strengths
      : ["No strengths recorded yet"];

  // ==========================================
  // Knowledge gaps
  // ==========================================

  const gaps =
    state?.gaps?.length > 0
      ? state.gaps
      : ["No knowledge gaps recorded yet"];

  // ==========================================
  // Recommendation
  // ==========================================

  let recommendation = state?.recommendation || "";

  if (!recommendation) {
    if (overall >= 85) {
      recommendation =
        "Excellent performance. Recommended for an AI Engineering Internship.";
    } else if (overall >= 70) {
      recommendation =
        "Good performance. Strong fundamentals with room for improvement.";
    } else {
      recommendation =
        "Needs more practice before attempting technical interviews.";
    }
  }

  // ==========================================
  // Score status
  // ==========================================

  const getScoreStatus = () => {
    if (overall >= 85) {
      return {
        label: "Excellent readiness",
        description:
          "Strong technical performance across the interview.",
      };
    }

    if (overall >= 70) {
      return {
        label: "Good foundation",
        description:
          "Solid fundamentals with clear opportunities to improve.",
      };
    }

    return {
      label: "Development required",
      description:
        "Additional preparation is recommended before the next interview.",
    };
  };

  const scoreStatus = getScoreStatus();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* ========================================== */}
      {/* Cinematic background */}
      {/* ========================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[15%] top-[-12%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.055] blur-[150px]" />

        <div className="absolute right-[-12%] top-[28%] h-[480px] w-[480px] rounded-full bg-cyan-400/[0.025] blur-[150px]" />

        <div className="absolute bottom-[-15%] left-[25%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.025] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      {/* ========================================== */}
      {/* Top navigation */}
      {/* ========================================== */}

      <div className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/candidate")}
            className="group inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] transition-all duration-300 group-hover:border-white/[0.15] group-hover:bg-white/[0.05]">
              <ArrowLeft size={15} />
            </span>

            Back to Candidates
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              Assessment complete
            </div>

            <span className="h-4 w-px bg-white/[0.08]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
              AI Interview Agent
            </span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Main */}
      {/* ========================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* ======================================== */}
        {/* Header */}
        {/* ======================================== */}

        <header className="max-w-4xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-400/10 bg-blue-400/[0.045] px-3.5 py-2">
            <BrainCircuit
              size={13}
              className="text-blue-300"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-300/75">
              AI Interview Analysis
            </span>
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">
            Interview
            <span className="block text-white/35">
              report.
            </span>
          </h1>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-base text-white/45">
              Candidate
            </p>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <p className="text-base font-semibold text-white">
              {candidateName}
            </p>
          </div>

          <p className="mt-3 text-sm leading-7 text-white/25">
            Based on {allScores.length} interview question
            {allScores.length !== 1 ? "s" : ""} and the
            candidate's evaluated responses.
          </p>
        </header>

        {/* ======================================== */}
        {/* Overall score */}
        {/* ======================================== */}

        <section className="relative mt-12 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          {/* Decorative lighting */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/[0.08] blur-[90px]" />

          <div className="pointer-events-none absolute bottom-[-100px] left-[20%] h-64 w-64 rounded-full bg-cyan-400/[0.025] blur-[80px]" />

          <div className="relative grid lg:grid-cols-[1fr_0.75fr]">
            {/* Score */}

            <div className="border-b border-white/[0.06] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.05]">
                  <BarChart3
                    size={17}
                    className="text-blue-300"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                    Overall performance
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Combined interview score
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-semibold tracking-[-0.07em] text-white sm:text-8xl">
                      {overall}
                    </span>

                    <span className="mb-3 text-xl text-white/20">
                      /100
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-white/35">
                    Overall interview score
                  </p>
                </div>

                {/* Circular-ish score visual */}

                <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-black/20">
                  <div className="absolute inset-2 rounded-full border border-blue-400/10" />

                  <div className="absolute inset-5 rounded-full border border-blue-400/[0.06]" />

                  <div className="relative text-center">
                    <Sparkles
                      size={16}
                      className="mx-auto text-blue-300"
                    />

                    <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                      AI rated
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, overall)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Status */}

            <div className="p-7 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={18}
                  className="text-emerald-300"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
                  Interview status
                </span>
              </div>

              <div className="mt-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Completed successfully
                  </span>
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-[-0.035em] text-white">
                  {scoreStatus.label}
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/35">
                  {scoreStatus.description}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Questions"
                  value={allScores.length}
                />

                <MiniMetric
                  label="Categories"
                  value="03"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* Score cards */}
        {/* ======================================== */}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/60">
                Performance breakdown
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">
                Evaluation dimensions
              </h2>
            </div>

            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-white/15 sm:block">
              Technical / Communication / Reasoning
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <PremiumScoreWrapper>
              <ScoreCard
                title="Technical"
                value={technical}
              />
            </PremiumScoreWrapper>

            <PremiumScoreWrapper>
              <ScoreCard
                title="Communication"
                value={communication}
              />
            </PremiumScoreWrapper>

            <PremiumScoreWrapper>
              <ScoreCard
                title="Problem Solving"
                value={problemSolving}
              />
            </PremiumScoreWrapper>
          </div>
        </section>

        {/* ======================================== */}
        {/* Strengths + gaps */}
        {/* ======================================== */}

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Strengths */}

          <InsightPanel
            type="strength"
            title="Strengths"
            subtitle="Areas where the candidate demonstrated confidence."
            items={strengths}
          />

          {/* Gaps */}

          <InsightPanel
            type="gap"
            title="Knowledge gaps"
            subtitle="Areas that should receive additional attention."
            items={gaps}
          />
        </section>

        {/* ======================================== */}
        {/* Recommendation */}
        {/* ======================================== */}

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <TrendingUp
              size={16}
              className="text-blue-300"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
              AI recommendation
            </span>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.02] shadow-[0_25px_80px_rgba(0,0,0,0.22)]">
            <Recommendation
              overall={overall}
              candidateName={candidateName}
              recommendation={recommendation}
            />
          </div>
        </section>

        {/* ======================================== */}
        {/* Bottom action */}
        {/* ======================================== */}

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              Assessment complete
            </p>

            <p className="mt-2 text-sm text-white/20">
              Ready for the next candidate?
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/candidate")}
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.08] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/40 hover:bg-blue-500/[0.14]"
          >
            Interview Another Candidate

            <ArrowUpRight
              size={16}
              className="text-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </main>

      {/* ========================================== */}
      {/* Footer marker */}
      {/* ========================================== */}

      <div className="relative z-10 border-t border-white/[0.05] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/15">
          <span className="h-px w-8 bg-white/[0.07]" />
          AI Interview Agent
          <span className="h-px w-8 bg-white/[0.07]" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Premium score wrapper
// ==========================================

function PremiumScoreWrapper({ children }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.02] shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/[0.16] hover:bg-white/[0.035]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/[0.07] opacity-0 blur-[55px] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// Mini metric
// ==========================================

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/20">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white/80">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// Insight panel
// ==========================================

function InsightPanel({
  type,
  title,
  subtitle,
  items,
}) {
  const isStrength = type === "strength";

  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.02] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8">
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-[80px] ${
          isStrength
            ? "bg-emerald-400/[0.035]"
            : "bg-amber-400/[0.035]"
        }`}
      />

      <div className="relative flex items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isStrength
                  ? "border-emerald-400/10 bg-emerald-400/[0.05]"
                  : "border-amber-400/10 bg-amber-400/[0.05]"
              }`}
            >
              {isStrength ? (
                <CheckCircle
                  size={18}
                  className="text-emerald-300"
                />
              ) : (
                <AlertTriangle
                  size={18}
                  className="text-amber-300"
                />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-[-0.025em] text-white">
                {title}
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/20">
                {items.length} item
                {items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-lg text-sm leading-6 text-white/30">
            {subtitle}
          </p>
        </div>

        <span
          className={`hidden h-2 w-2 rounded-full sm:block ${
            isStrength
              ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]"
              : "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.55)]"
          }`}
        />
      </div>

      <div className="relative mt-7 space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="group/item flex items-start gap-3 rounded-xl border border-white/[0.05] bg-black/20 p-4 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.025]"
          >
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                isStrength
                  ? "bg-emerald-400/[0.06] text-emerald-300"
                  : "bg-amber-400/[0.06] text-amber-300"
              }`}
            >
              {isStrength ? (
                <CheckCircle size={13} />
              ) : (
                <AlertTriangle size={13} />
              )}
            </div>

            <p className="text-sm leading-6 text-white/55 transition-colors duration-300 group-hover/item:text-white/75">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}