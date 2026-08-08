import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

export default function Report() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // User
  // ==========================================

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const isAdmin = user.role === "admin";

  // ==========================================
  // State
  // ==========================================

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expandedQuestion, setExpandedQuestion] =
    useState(null);

  // ==========================================
  // Token
  // ==========================================

  const getToken = () =>
    localStorage.getItem("token");

  // ==========================================
  // Demo fallback
  // ==========================================

  const createFallbackReport = useCallback(() => {
    return {
      id: id || "demo-report",
      candidateName:
        user.name || "Candidate",
      candidateEmail:
        user.email || "",
      position: "Technical Interview",
      overallScore: 82,
      technicalScore: 85,
      communicationScore: 79,
      problemSolvingScore: 84,
      experienceScore: 81,
      recommendation: "Recommended",
      status: "completed",
      durationMinutes: 38,
      completedAt:
        new Date().toISOString(),
      summary:
        "The candidate demonstrated strong technical reasoning, practical problem-solving ability, and a solid understanding of software engineering fundamentals.",
      strengths: [
        "Strong technical reasoning",
        "Clear problem-solving approach",
        "Good understanding of engineering fundamentals",
        "Able to explain implementation decisions",
      ],
      weaknesses: [
        "Some answers could be more concise",
        "Architecture explanations could include more trade-off analysis",
      ],
      questions: [
        {
          id: 1,
          category: "Technical",
          question:
            "Describe a challenging technical problem you have solved.",
          answer:
            "The candidate explained the problem, identified the root cause, and described a structured implementation approach.",
          score: 86,
          feedback:
            "Strong answer with a clear technical process.",
        },
        {
          id: 2,
          category: "Problem Solving",
          question:
            "How do you approach debugging a production issue?",
          answer:
            "The candidate described reproducing the issue, checking logs and metrics, isolating the failure, and validating the fix.",
          score: 88,
          feedback:
            "Demonstrates a systematic debugging methodology.",
        },
        {
          id: 3,
          category: "Architecture",
          question:
            "How would you design a scalable web application?",
          answer:
            "The candidate discussed APIs, databases, caching, horizontal scaling, monitoring, and deployment.",
          score: 80,
          feedback:
            "Good foundation, but additional trade-off discussion would strengthen the answer.",
        },
        {
          id: 4,
          category: "Behavioral",
          question:
            "Describe a technical disagreement with your team.",
          answer:
            "The candidate described comparing alternatives, discussing constraints, and aligning on the solution with the team.",
          score: 78,
          feedback:
            "Good collaborative approach with room for more concrete examples.",
        },
      ],
    };
  }, [id, user.email, user.name]);

  // ==========================================
  // Load report
  // ==========================================

  const loadReport = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        let endpoint = "";

        if (id) {
          endpoint = `/api/reports/${encodeURIComponent(
            id
          )}`;
        } else {
          endpoint = "/api/reports/latest";
        }

        const response = await fetch(
          `${API_URL}${endpoint}`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to load report. HTTP ${response.status}`
          );
        }

        const incomingReport =
          data.report ||
          data.result ||
          data;

        if (
          !incomingReport ||
          typeof incomingReport !==
            "object"
        ) {
          throw new Error(
            "No report data was returned."
          );
        }

        setReport(
          normalizeReport(
            incomingReport
          )
        );
      } catch (requestError) {
        console.error(
          "Load report error:",
          requestError
        );

        /*
         * Keep the report page usable while the
         * backend report endpoint is being added.
         */
        setReport(
          createFallbackReport()
        );

        setError(
          "Live report data is not available yet. Showing the report preview."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      id,
      navigate,
      createFallbackReport,
    ]
  );

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  // ==========================================
  // Score
  // ==========================================

  const overallScore =
    Number(
      report?.overallScore
    ) || 0;

  const scoreLabel =
    getScoreLabel(
      overallScore
    );

  // ==========================================
  // Dashboard
  // ==========================================

  const goBack = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/employee");
    }
  };

  // ==========================================
  // Render loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-500/[0.06]">
            <Loader2
              size={24}
              className="animate-spin text-blue-300"
            />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Preparing report...
          </h1>

          <p className="mt-2 text-sm text-white/30">
            Analyzing interview results.
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <EmptyReport
        onBack={goBack}
        onRefresh={() =>
          loadReport()
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      <AmbientBackground />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* ========================================
          Header
      ======================================== */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.06]">
              <BrainCircuit
                size={21}
                strokeWidth={1.4}
                className="text-blue-300"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-400">
                AI Evaluation
              </p>

              <h1 className="mt-0.5 text-lg font-semibold">
                Interview Report
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/50 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
        </div>
      </header>

      {/* ========================================
          Main
      ======================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* ======================================
            Heading
        ====================================== */}

        <div className="flex flex-col gap-7 border-b border-white/[0.07] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                Evaluation Results
              </span>
            </div>

            <h2 className="mt-6 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Interview{" "}
              <span className="text-white/40">
                report.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35">
              AI-assisted evaluation of the candidate's
              technical performance, communication, and
              problem-solving ability.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadReport({
                silent: true,
              })
            }
            disabled={refreshing}
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/45 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "animate-spin"
                  : "transition-transform duration-300 group-hover:rotate-180"
              }
            />

            Refresh
          </button>
        </div>

        {/* Preview warning */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/[0.035] p-4 text-xs text-amber-300/70">
            <Sparkles
              size={16}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================
            Candidate card
        ====================================== */}

        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018]">
          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-blue-500/[0.045] blur-[100px]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-500/[0.06]">
                  <span className="text-lg font-semibold text-blue-200">
                    {getInitials(
                      report.candidateName
                    )}
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                    Candidate
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                    {report.candidateName}
                  </h3>

                  {report.candidateEmail && (
                    <p className="mt-1 text-sm text-white/30">
                      {report.candidateEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <StatusBadge
                  recommendation={
                    report.recommendation
                  }
                />

                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  <Clock3 size={12} />

                  {report.durationMinutes ||
                    0}{" "}
                  min
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================
            Score overview
        ====================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[330px_1fr]">
          {/* Overall score */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-7">
            <div className="pointer-events-none absolute left-1/2 top-[-100px] h-56 w-72 -translate-x-1/2 rounded-full bg-blue-500/[0.055] blur-[90px]" />

            <div className="relative text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.23em] text-white/20">
                Overall score
              </p>

              <ScoreRing
                score={overallScore}
                label={scoreLabel}
              />

              <div className="mt-5">
                <p className="text-sm font-semibold text-white/65">
                  {scoreLabel}
                </p>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  Overall AI evaluation based on the
                  completed interview.
                </p>
              </div>
            </div>
          </div>

          {/* Score categories */}

          <div className="grid gap-px overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
            <ScoreCard
              label="Technical"
              score={
                report.technicalScore
              }
              icon={BrainCircuit}
            />

            <ScoreCard
              label="Problem solving"
              score={
                report.problemSolvingScore
              }
              icon={Target}
            />

            <ScoreCard
              label="Communication"
              score={
                report.communicationScore
              }
              icon={User}
            />

            <ScoreCard
              label="Experience"
              score={
                report.experienceScore
              }
              icon={TrendingUp}
            />
          </div>
        </section>

        {/* ======================================
            Summary
        ====================================== */}

        <section className="mt-6 rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-7 sm:p-8">
          <SectionHeading
            icon={Sparkles}
            eyebrow="AI Summary"
            title="Performance overview"
          />

          <p className="mt-6 max-w-5xl text-sm leading-7 text-white/40">
            {report.summary}
          </p>
        </section>

        {/* ======================================
            Strengths / weaknesses
        ====================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <InsightCard
            title="Key strengths"
            icon={CheckCircle2}
            items={
              report.strengths
            }
            type="positive"
          />

          <InsightCard
            title="Areas to improve"
            icon={Target}
            items={
              report.weaknesses
            }
            type="negative"
          />
        </section>

        {/* ======================================
            Question analysis
        ====================================== */}

        <section className="mt-14">
          <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-blue-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  Detailed Evaluation
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Question analysis.
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/30">
                Review the candidate's answers and AI-generated
                feedback for each interview question.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
              <FileText size={12} />

              {report.questions.length} questions
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {report.questions.map(
              (question, index) => {
                const expanded =
                  expandedQuestion ===
                  question.id;

                return (
                  <QuestionResult
                    key={
                      question.id ||
                      index
                    }
                    question={
                      question
                    }
                    index={index}
                    expanded={
                      expanded
                    }
                    onToggle={() =>
                      setExpandedQuestion(
                        expanded
                          ? null
                          : question.id
                      )
                    }
                  />
                );
              }
            )}
          </div>
        </section>

        {/* ======================================
            Final recommendation
        ====================================== */}

        <section className="mt-10 overflow-hidden rounded-[28px] border border-blue-400/10 bg-blue-400/[0.025] p-7 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.06]">
                <Award
                  size={21}
                  className="text-blue-300"
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/55">
                  Final recommendation
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                  {report.recommendation}
                </h3>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-white/30">
                  This recommendation is based on the overall
                  interview evaluation and individual competency
                  scores.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={goBack}
              className="group inline-flex w-fit items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Return to Dashboard

              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </section>

        {/* ======================================
            Security
        ====================================== */}

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
          <ShieldCheck
            size={17}
            className="text-emerald-300/60"
          />

          <p className="text-[10px] leading-5 text-white/25">
            Report access is protected by the authenticated
            interview workflow.
          </p>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Normalize backend report
// ==========================================

function normalizeReport(data) {
  const source =
    data.report || data;

  const score = (
    value,
    fallback = 0
  ) => {
    const number =
      Number(value);

    if (
      Number.isFinite(number)
    ) {
      return Math.max(
        0,
        Math.min(100, number)
      );
    }

    return fallback;
  };

  const questions =
    Array.isArray(
      source.questions
    )
      ? source.questions
      : Array.isArray(
          source.answers
        )
      ? source.answers
      : [];

  return {
    id:
      source.id ||
      source.reportId ||
      "report",

    candidateName:
      source.candidateName ||
      source.employee_name ||
      source.employeeName ||
      "Candidate",

    candidateEmail:
      source.candidateEmail ||
      source.employee_email ||
      source.employeeEmail ||
      "",

    position:
      source.position ||
      "Technical Interview",

    overallScore: score(
      source.overallScore ??
        source.overall_score,
      0
    ),

    technicalScore: score(
      source.technicalScore ??
        source.technical_score,
      0
    ),

    communicationScore: score(
      source.communicationScore ??
        source.communication_score,
      0
    ),

    problemSolvingScore: score(
      source.problemSolvingScore ??
        source.problem_solving_score,
      0
    ),

    experienceScore: score(
      source.experienceScore ??
        source.experience_score,
      0
    ),

    recommendation:
      source.recommendation ||
      "Under Review",

    status:
      source.status ||
      "completed",

    durationMinutes:
      Number(
        source.durationMinutes ??
          source.duration_minutes
      ) || 0,

    completedAt:
      source.completedAt ||
      source.completed_at ||
      null,

    summary:
      source.summary ||
      source.overallSummary ||
      "No summary was provided.",

    strengths:
      normalizeStringArray(
        source.strengths
      ),

    weaknesses:
      normalizeStringArray(
        source.weaknesses
      ),

    questions:
      questions.map(
        (item, index) => ({
          id:
            item.id ||
            item.questionId ||
            index + 1,

          category:
            item.category ||
            "Interview",

          question:
            item.question ||
            item.questionText ||
            `Question ${index + 1}`,

          answer:
            item.answer ||
            item.response ||
            "No answer recorded.",

          score: score(
            item.score ??
              item.questionScore,
            0
          ),

          feedback:
            item.feedback ||
            item.evaluation ||
            "No detailed feedback was provided.",
        })
      ),
  };
}

// ==========================================
// String array helper
// ==========================================

function normalizeStringArray(
  value
) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item)
      )
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) =>
        item.replace(
          /^[-•]\s*/,
          ""
        ).trim()
      )
      .filter(Boolean);
  }

  return [];
}

// ==========================================
// Score label
// ==========================================

function getScoreLabel(score) {
  if (score >= 90) {
    return "Exceptional";
  }

  if (score >= 80) {
    return "Strong";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 60) {
    return "Developing";
  }

  return "Needs improvement";
}

// ==========================================
// Initials
// ==========================================

function getInitials(name) {
  return String(name || "C")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ==========================================
// Score ring
// ==========================================

function ScoreRing({
  score,
  label,
}) {
  const radius = 76;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (score / 100) *
      circumference;

  return (
    <div className="relative mx-auto mt-6 h-52 w-52">
      <svg
        viewBox="0 0 180 180"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-white/[0.05]"
        />

        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            offset
          }
          className="text-blue-400 transition-all duration-1000"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-semibold tracking-[-0.06em]">
          {score}
        </span>

        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
          / 100
        </span>
      </div>
    </div>
  );
}

// ==========================================
// Score card
// ==========================================

function ScoreCard({
  label,
  score,
  icon: Icon,
}) {
  const value =
    Number(score) || 0;

  return (
    <div className="group bg-[#080b10]/90 p-6 transition-all duration-500 hover:bg-[#0b0f15]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
            {label}
          </p>

          <p className="mt-6 text-4xl font-semibold tracking-[-0.05em]">
            {value}
          </p>
        </div>

        <Icon
          size={18}
          strokeWidth={1.4}
          className="text-white/15 transition-colors group-hover:text-blue-300/60"
        />
      </div>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-700"
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <p className="mt-3 text-[10px] text-white/20">
        {getScoreLabel(value)}
      </p>
    </div>
  );
}

// ==========================================
// Status badge
// ==========================================

function StatusBadge({
  recommendation,
}) {
  const normalized =
    String(
      recommendation || ""
    ).toLowerCase();

  const positive =
    normalized.includes(
      "recommend"
    ) &&
    !normalized.includes(
      "not"
    );

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] ${
        positive
          ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300"
          : "border-amber-400/15 bg-amber-400/[0.05] text-amber-300"
      }`}
    >
      {positive ? (
        <CheckCircle2 size={12} />
      ) : (
        <Target size={12} />
      )}

      {recommendation}
    </span>
  );
}

// ==========================================
// Section heading
// ==========================================

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.06]">
        <Icon
          size={17}
          className="text-blue-300"
        />
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/55">
          {eyebrow}
        </p>

        <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
          {title}
        </h3>
      </div>
    </div>
  );
}

// ==========================================
// Insight card
// ==========================================

function InsightCard({
  title,
  icon: Icon,
  items,
  type,
}) {
  const positive =
    type === "positive";

  return (
    <div
      className={`rounded-[28px] border p-7 sm:p-8 ${
        positive
          ? "border-emerald-400/10 bg-emerald-400/[0.018]"
          : "border-amber-400/10 bg-amber-400/[0.018]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            positive
              ? "border-emerald-400/10 bg-emerald-400/[0.04]"
              : "border-amber-400/10 bg-amber-400/[0.04]"
          }`}
        >
          <Icon
            size={17}
            className={
              positive
                ? "text-emerald-300/75"
                : "text-amber-300/75"
            }
          />
        </div>

        <h3 className="text-xl font-semibold tracking-[-0.03em]">
          {title}
        </h3>
      </div>

      <div className="mt-6 space-y-3">
        {items.length > 0 ? (
          items.map(
            (item, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-white/[0.05] bg-black/10 p-4"
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    positive
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }`}
                />

                <p className="text-xs leading-6 text-white/40">
                  {item}
                </p>
              </div>
            )
          )
        ) : (
          <p className="text-xs text-white/25">
            No observations available.
          </p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Question result
// ==========================================

function QuestionResult({
  question,
  index,
  expanded,
  onToggle,
}) {
  const score =
    Number(question.score) || 0;

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.018] transition-all duration-300 hover:border-white/[0.12]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <span className="text-[10px] font-semibold text-white/35">
            {String(
              index + 1
            ).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[8px] font-semibold uppercase tracking-[0.17em] text-blue-300/50">
              {question.category}
            </span>
          </div>

          <h4 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white/75">
            {question.question}
          </h4>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-2xl font-semibold tracking-[-0.04em]">
              {score}
            </p>

            <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
              score
            </p>
          </div>

          {expanded ? (
            <ChevronUp
              size={17}
              className="text-white/25"
            />
          ) : (
            <ChevronDown
              size={17}
              className="text-white/25"
            />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] bg-black/10 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                Candidate answer
              </p>

              <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
                <p className="text-sm leading-7 text-white/40">
                  {question.answer}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                AI feedback
              </p>

              <div className="mt-3 rounded-2xl border border-blue-400/10 bg-blue-400/[0.025] p-5">
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={15}
                    className="mt-1 shrink-0 text-blue-300/60"
                  />

                  <p className="text-sm leading-7 text-white/40">
                    {question.feedback}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/20">
              Question score
            </span>

            <span className="text-sm font-semibold text-blue-300">
              {score}/100
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

// ==========================================
// Empty report
// ==========================================

function EmptyReport({
  onBack,
  onRefresh,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05070a] px-6 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <FileText
            size={24}
            className="text-white/25"
          />
        </div>

        <h1 className="mt-5 text-2xl font-semibold">
          No report available
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/30">
          The interview report has not been generated yet.
        </p>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-white/50 transition hover:bg-white/[0.05] hover:text-white"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Background
// ==========================================

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute left-[5%] top-[-15%] h-[540px] w-[540px] rounded-full bg-blue-500/[0.04] blur-[160px]" />

      <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.025] blur-[150px]" />

      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.018] blur-[160px]" />

      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
      />
    </div>
  );
}