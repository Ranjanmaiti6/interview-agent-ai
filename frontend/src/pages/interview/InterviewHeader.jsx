import {
  ArrowLeft,
  BrainCircuit,
  Clock3,
  Gauge,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InterviewHeader({
  questionNumber,
  totalQuestions,
  candidateName,
  topic,
  difficulty,
}) {
  const navigate = useNavigate();

  const safeTotal = Math.max(totalQuestions || 1, 1);
  const safeQuestion = Math.min(
    Math.max(questionNumber || 0, 0),
    safeTotal
  );

  const progress =
    (safeQuestion / safeTotal) * 100;

  const remaining = Math.max(
    safeTotal - safeQuestion,
    0
  );

  const normalizedDifficulty =
    difficulty || "Adaptive";

  const difficultyLabel =
    normalizedDifficulty.charAt(0).toUpperCase() +
    normalizedDifficulty.slice(1);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080b10]/90 backdrop-blur-2xl">
      {/* Top ambient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-white/[0.09]
                bg-white/[0.035]
                text-white/55
                transition-all duration-300
                hover:border-white/[0.16]
                hover:bg-white/[0.07]
                hover:text-white
              "
              aria-label="Back to home"
            >
              <ArrowLeft size={17} />
            </button>

            <div
              className="
                hidden h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-blue-400/15
                bg-blue-500/[0.07]
                sm:flex
              "
            >
              <BrainCircuit
                size={20}
                strokeWidth={1.5}
                className="text-blue-300"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                  AI Interview
                </h1>

                <span className="hidden rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:inline-flex">
                  Live
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/35">
                <UserRound size={12} />

                <span className="truncate">
                  {candidateName || "Candidate"}
                </span>
              </div>
            </div>
          </div>

          {/* Question counter */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Progress
              </p>

              <p className="mt-0.5 text-sm font-semibold text-white">
                {safeQuestion}
                <span className="text-white/25">
                  {" "}
                  / {safeTotal}
                </span>
              </p>
            </div>

            <div className="h-9 w-px bg-white/[0.08]" />

            <div className="flex items-center gap-2">
              <Clock3
                size={14}
                className="text-blue-400/70"
              />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Remaining
                </p>

                <p className="mt-0.5 text-sm font-semibold text-white">
                  {remaining}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile progress info */}
        <div className="mt-4 flex items-center justify-between sm:hidden">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Question
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {safeQuestion}
              <span className="text-white/25">
                {" "}
                / {safeTotal}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Remaining
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {remaining}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="
                  h-full rounded-full
                  bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300
                  shadow-[0_0_16px_rgba(59,130,246,0.45)]
                  transition-all duration-700 ease-out
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <span className="shrink-0 font-mono text-[10px] text-white/30">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Interview metadata */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div
            className="
              group flex min-w-0 items-center gap-2.5
              rounded-xl
              border border-white/[0.06]
              bg-white/[0.02]
              px-3 py-2.5
            "
          >
            <BrainCircuit
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-blue-400/70"
            />

            <div className="min-w-0">
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Topic
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-white/70">
                {topic || "General AI"}
              </p>
            </div>
          </div>

          <div
            className="
              group flex min-w-0 items-center gap-2.5
              rounded-xl
              border border-white/[0.06]
              bg-white/[0.02]
              px-3 py-2.5
            "
          >
            <Gauge
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-blue-400/70"
            />

            <div className="min-w-0">
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Difficulty
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-white/70">
                {difficultyLabel}
              </p>
            </div>
          </div>

          <div
            className="
              hidden min-w-0 items-center justify-between
              rounded-xl
              border border-white/[0.06]
              bg-white/[0.02]
              px-3 py-2.5
              sm:flex
            "
          >
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Interview state
              </p>

              <p className="mt-0.5 text-xs font-medium text-emerald-400/80">
                In progress
              </p>
            </div>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}