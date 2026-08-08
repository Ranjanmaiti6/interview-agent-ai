import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import InterviewHeader from "../../components/interview/InterviewHeader";
import ChatMessage from "../../components/interview/ChatMessage";
import InterviewInput from "../../components/interview/InterviewInput";

// ==========================================
// API URL
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

// ==========================================
// Interview topics
// ==========================================

const topics = [
  "Retrieval-Augmented Generation",
  "Vector Databases",
  "Prompt Engineering",
  "AI Agents",
  "Model Context Protocol",
  "LLM Deployment",
  "AI Evaluation",
  "System Design",
];

// ==========================================
// Difficulty
// ==========================================

const difficulties = [
  "Easy",
  "Easy",
  "Medium",
  "Medium",
  "Medium",
  "Hard",
  "Hard",
  "Hard",
];

// ==========================================
// Total questions
// ==========================================

const totalQuestions = 8;

// ==========================================
// Initial question
// ==========================================

const initialQuestion =
  "Explain how Retrieval-Augmented Generation (RAG) works in an AI application.";

// ==========================================
// Main component
// ==========================================

export default function Interview() {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ========================================
  // Logged-in user
  // ========================================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ========================================
  // Meeting information
  // ========================================

  const meetingId =
    location.state?.meetingId || null;

  const meetingEmployeeEmail =
    location.state?.employeeEmail ||
    user.email ||
    null;

  const meetingTitle =
    location.state?.meetingTitle ||
    "AI Interview";

  // ========================================
  // Candidate
  // ========================================

  const candidateId =
    searchParams.get("id");

  const candidateName =
    user.name ||
    "Employee";

  // ========================================
  // State
  // ========================================

  const [
    questionNumber,
    setQuestionNumber,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    completed,
    setCompleted,
  ] = useState(false);

  const [
    score,
    setScore,
  ] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
  });

  const [
    allScores,
    setAllScores,
  ] = useState([]);

  // ========================================
  // Chat messages
  // ========================================

  const [
    messages,
    setMessages,
  ] = useState([
    {
      role: "ai",

      text:
        `Welcome to your AI Technical Interview.\n\n` +
        `Meeting: ${meetingTitle}\n\n` +
        `Let's begin.\n\n` +
        initialQuestion,
    },
  ]);

  // ========================================
  // Bottom reference
  // ========================================

  const bottomRef =
    useRef(null);

  // ========================================
  // Auto scroll
  // ========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages,
    loading,
  ]);

  // ========================================
  // Send answer
  // ========================================

  const sendAnswer = async (
    answer
  ) => {
    // --------------------------------------
    // Prevent invalid submissions
    // --------------------------------------

    if (
      !answer ||
      !answer.trim() ||
      loading ||
      completed
    ) {
      return;
    }

    const cleanAnswer =
      answer.trim();

    // --------------------------------------
    // Add candidate answer
    // --------------------------------------

    setMessages((prev) => [
      ...prev,

      {
        role: "user",
        text: cleanAnswer,
      },
    ]);

    setLoading(true);

    try {
      // ====================================
      // API endpoint
      // ====================================

      const endpoint =
        `${API_URL}/api/interview/answer`;

      console.log(
        "Sending interview answer to:",
        endpoint
      );

      // ====================================
      // Authentication
      // ====================================

      const token =
        localStorage.getItem("token");

      // ====================================
      // Backend request
      // ====================================

      const response =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            body: JSON.stringify({
              answer:
                cleanAnswer,

              // Backend uses zero-based index
              questionNumber:
                questionNumber - 1,

              candidateId,

              meetingId,

              employeeEmail:
                meetingEmployeeEmail,
            }),
          }
        );

      // ====================================
      // HTTP error
      // ====================================

      if (!response.ok) {
        let errorMessage =
          `Backend returned ${response.status}`;

        try {
          const errorData =
            await response.json();

          if (
            errorData?.message
          ) {
            errorMessage =
              errorData.message;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      // ====================================
      // Parse response
      // ====================================

      const data =
        await response.json();

      console.log(
        "Interview response:",
        data
      );

      // ====================================
      // Latest score
      // ====================================

      const latestScore =
        data.score || {
          technical: 0,
          communication: 0,
          problemSolving: 0,
        };

      setScore(
        latestScore
      );

      // ====================================
      // Store all question scores
      // ====================================

      const updatedScores = [
        ...allScores,
        latestScore,
      ];

      setAllScores(
        updatedScores
      );

      // ====================================
      // Feedback
      // ====================================

      setMessages((prev) => [
        ...prev,

        {
          role: "ai",

          text:
            `Feedback\n\n${
              data.feedback ||
              "Good answer."
            }`,
        },
      ]);

      // ====================================
      // Interview completed
      // ====================================

      if (
        questionNumber >=
        totalQuestions
      ) {
        setCompleted(true);

        setMessages((prev) => [
          ...prev,

          {
            role: "ai",

            text:
              "Interview completed.\n\n" +
              "Your answers have been evaluated. " +
              "We're now preparing your personalized AI report.",
          },
        ]);

        // ----------------------------------
        // Go to report
        // ----------------------------------

        setTimeout(() => {
          navigate(
            "/report",
            {
              state: {
                score:
                  latestScore,

                allScores:
                  updatedScores,

                strengths:
                  data.strengths ||
                  [],

                gaps:
                  data.gaps ||
                  [],

                recommendation:
                  data.recommendation ||
                  "",

                candidateName,

                meetingId,

                meetingTitle,

                employeeEmail:
                  meetingEmployeeEmail,
              },
            }
          );
        }, 2500);

        return;
      }

      // ====================================
      // Next question
      // ====================================

      setMessages((prev) => [
        ...prev,

        {
          role: "ai",

          text:
            `Next Question\n\n${
              data.nextQuestion ||
              "Let's continue with the next question."
            }`,
        },
      ]);

      // ====================================
      // Increment question
      // ====================================

      setQuestionNumber(
        (prev) => prev + 1
      );

    } catch (error) {
      // ====================================
      // Error handling
      // ====================================

      console.error(
        "Interview error:",
        error
      );

      setMessages((prev) => [
        ...prev,

        {
          role: "ai",

          text:
            `Backend error.\n\n` +
            `${error.message}\n\n` +
            `Please check that the backend is running and the API URL is configured correctly.`,
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Completion screen
  // ==========================================

  if (completed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040609] px-5 text-white sm:px-6">

        {/* ====================================== */}
        {/* Completion atmosphere */}
        {/* ====================================== */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.065] blur-[170px]" />

          <div className="absolute left-1/2 top-[20%] h-[220px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/[0.025] blur-[100px]" />

          <div
            className="
              absolute
              inset-0
              opacity-[0.025]
              [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)]
              [background-size:34px_34px]
            "
          />

        </div>

        {/* ====================================== */}
        {/* Completion container */}
        {/* ====================================== */}

        <div className="relative z-10 w-full max-w-2xl">

          {/* Status */}

          <div className="mb-8 flex justify-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.045] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">

              <CheckCircle2
                size={14}
              />

              Interview complete

            </div>

          </div>

          {/* Main card */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.09]
              bg-white/[0.025]
              p-7
              text-center
              shadow-[0_40px_140px_rgba(0,0,0,0.5)]
              backdrop-blur-2xl
              sm:p-12
            "
          >

            {/* Card light */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-96 -translate-x-1/2 rounded-full bg-blue-500/[0.10] blur-[90px]" />

            <div className="relative">

              {/* Icon */}

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-blue-300/15 bg-blue-500/[0.07] shadow-[0_0_70px_rgba(59,130,246,0.16)]">

                <BrainCircuit
                  size={38}
                  strokeWidth={1.3}
                  className="text-blue-300"
                />

              </div>

              <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-blue-300/50">
                AI Interview Agent
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Interview Completed
              </h1>

              <p className="mt-4 text-base leading-7 text-white/45">
                Great work, {candidateName}.
              </p>

              {/* Analysis status */}

              <div className="mt-10 rounded-2xl border border-white/[0.07] bg-black/20 p-5 text-left sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.06]">

                    <Sparkles
                      size={18}
                      className="text-blue-300"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-white">
                      Generating your AI report
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Analyzing technical performance and knowledge gaps
                    </p>

                  </div>

                </div>

                {/* Processing animation */}

                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                  <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-600 via-blue-300 to-cyan-300 animate-[completionPulse_1.8s_ease-in-out_infinite]" />

                </div>

                <div className="mt-4 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-white/25">

                  <span>
                    Processing
                  </span>

                  <span>
                    Please wait
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        <style>
          {`
            @keyframes completionPulse {
              0% {
                opacity: 0.45;
                transform: scaleX(0.82);
                transform-origin: left;
              }

              50% {
                opacity: 1;
                transform: scaleX(1);
                transform-origin: left;
              }

              100% {
                opacity: 0.45;
                transform: scaleX(0.82);
                transform-origin: right;
              }
            }
          `}
        </style>

      </div>
    );
  }

  // ==========================================
  // Current topic
  // ==========================================

  const currentTopic =
    topics[
      questionNumber - 1
    ];

  const currentDifficulty =
    difficulties[
      questionNumber - 1
    ];

  const progress =
    (questionNumber /
      totalQuestions) *
    100;

  // ==========================================
  // Interview screen
  // ==========================================

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#05070a] text-white">

      {/* ====================================== */}
      {/* Fixed ambient background */}
      {/* ====================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">

        <div className="absolute left-[18%] top-[-20%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.035] blur-[160px]" />

        <div className="absolute right-[-15%] top-[28%] h-[470px] w-[470px] rounded-full bg-cyan-500/[0.022] blur-[160px]" />

        <div className="absolute bottom-[-20%] left-[8%] h-[520px] w-[520px] rounded-full bg-indigo-500/[0.022] blur-[160px]" />

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)]
            [background-size:34px_34px]
          "
        />

      </div>

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="relative z-40 shrink-0">

        <InterviewHeader
          questionNumber={
            questionNumber
          }

          totalQuestions={
            totalQuestions
          }

          candidateName={
            candidateName
          }

          topic={
            currentTopic
          }

          difficulty={
            currentDifficulty
          }
        />

      </div>

      {/* ====================================== */}
      {/* Main workspace */}
      {/* ====================================== */}

      <main className="relative z-10 flex min-h-0 flex-1">

        <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-3 pb-36 pt-4 sm:px-5 sm:pt-5 lg:px-8 lg:pt-6">

          {/* ================================== */}
          {/* Session information */}
          {/* ================================== */}

          <div className="mb-4 grid gap-2.5 sm:grid-cols-3 lg:mb-5">

            {/* Engine */}

            <div
              className="
                group
                rounded-2xl
                border border-white/[0.06]
                bg-white/[0.018]
                px-4 py-3
                backdrop-blur-xl
                transition-all duration-300
                hover:border-white/[0.10]
                hover:bg-white/[0.025]
              "
            >

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/[0.05]">

                  <Cpu
                    size={15}
                    className="text-blue-300/80"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Interview engine
                  </p>

                  <p className="mt-0.5 truncate text-xs text-white/65">
                    Adaptive AI
                  </p>

                </div>

              </div>

            </div>

            {/* Context */}

            <div
              className="
                group
                rounded-2xl
                border border-white/[0.06]
                bg-white/[0.018]
                px-4 py-3
                backdrop-blur-xl
                transition-all duration-300
                hover:border-white/[0.10]
                hover:bg-white/[0.025]
              "
            >

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/[0.05]">

                  <Database
                    size={15}
                    className="text-blue-300/80"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Context
                  </p>

                  <p className="mt-0.5 truncate text-xs text-white/65">
                    Candidate-aware
                  </p>

                </div>

              </div>

            </div>

            {/* Status */}

            <div
              className="
                group
                rounded-2xl
                border border-white/[0.06]
                bg-white/[0.018]
                px-4 py-3
                backdrop-blur-xl
                transition-all duration-300
                hover:border-emerald-400/10
                hover:bg-emerald-400/[0.02]
              "
            >

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.05]">

                  <ShieldCheck
                    size={15}
                    className="text-emerald-300/80"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Session status
                  </p>

                  <p className="mt-0.5 flex items-center gap-2 text-xs text-white/65">

                    <span className="relative flex h-1.5 w-1.5">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                    </span>

                    Live

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================================== */}
          {/* Interview content */}
          {/* ================================== */}

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-5">

            {/* ================================= */}
            {/* Conversation */}
            {/* ================================= */}

            <section
              className="
                relative
                flex
                min-h-[520px]
                flex-1
                flex-col
                overflow-hidden
                rounded-[26px]
                border border-white/[0.07]
                bg-white/[0.018]
                shadow-[0_30px_100px_rgba(0,0,0,0.30)]
                backdrop-blur-xl
              "
            >

              {/* Conversation top glow */}

              <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-80 -translate-x-1/2 rounded-full bg-blue-500/[0.025] blur-[70px]" />

              {/* Conversation header */}

              <div className="relative flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-6 sm:py-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.06]">

                    <MessageSquareText
                      size={17}
                      className="text-blue-300"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-white/90">
                      Interview conversation
                    </p>

                    <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.18em] text-white/25">
                      Live technical assessment
                    </p>

                  </div>

                </div>

                <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25 sm:flex">

                  <Clock3
                    size={11}
                  />

                  Q{questionNumber}{" "}
                  / {totalQuestions}

                </div>

              </div>

              {/* Messages */}

              <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">

                <div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-6 sm:py-8">

                  <div className="space-y-4 sm:space-y-5">

                    {messages.map(
                      (
                        message,
                        index
                      ) => (
                        <div
                          key={index}
                          className="
                            animate-[fadeIn_0.45s_ease-out]
                          "
                        >

                          <ChatMessage
                            role={
                              message.role
                            }
                            text={
                              message.text
                            }
                          />

                        </div>
                      )
                    )}

                    {/* ================================= */}
                    {/* Loading state */}
                    {/* ================================= */}

                    {loading && (
                      <div className="flex justify-start">

                        <div className="flex max-w-[88%] items-center gap-3 rounded-2xl rounded-tl-md border border-blue-400/10 bg-blue-400/[0.035] px-4 py-3.5 shadow-[0_15px_50px_rgba(37,99,235,0.06)] sm:px-5 sm:py-4">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-300/10 bg-blue-300/[0.05]">

                            <Loader2
                              size={15}
                              className="animate-spin text-blue-300"
                            />

                          </div>

                          <div className="min-w-0">

                            <p className="text-xs font-semibold text-white/75">
                              AI is analyzing your answer
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/25">
                              Preparing next evaluation
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                    <div
                      ref={
                        bottomRef
                      }
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* ================================= */}
            {/* Right intelligence panel */}
            {/* ================================= */}

            <aside className="hidden lg:block">

              <div className="sticky top-6 space-y-4">

                {/* Progress */}

                <div className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Target
                        size={15}
                        className="text-blue-300"
                      />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                        Progress
                      </span>

                    </div>

                    <span className="font-mono text-xs text-white/35">
                      {Math.round(
                        progress
                      )}
                      %
                    </span>

                  </div>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-300 to-cyan-300 shadow-[0_0_16px_rgba(59,130,246,0.25)] transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-white/25">

                    <span>
                      Current
                    </span>

                    <span>
                      {questionNumber} /{" "}
                      {totalQuestions}
                    </span>

                  </div>

                </div>

                {/* Current topic */}

                <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">

                  <div className="flex items-center gap-2">

                    <Zap
                      size={15}
                      className="text-blue-300"
                    />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      Current focus
                    </span>

                  </div>

                  <h3 className="mt-5 text-lg font-semibold leading-6 tracking-[-0.025em] text-white">
                    {currentTopic}
                  </h3>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.6)]" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {currentDifficulty} difficulty
                    </span>

                  </div>

                </div>

                {/* Latest score */}

                <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Sparkles
                        size={15}
                        className="text-blue-300"
                      />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                        Latest evaluation
                      </span>

                    </div>

                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <ScoreItem
                      label="Tech"
                      value={
                        score.technical
                      }
                    />

                    <ScoreItem
                      label="Comm"
                      value={
                        score.communication
                      }
                    />

                    <ScoreItem
                      label="Solve"
                      value={
                        score.problemSolving
                      }
                    />

                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-white/25">
                    Scores update after each submitted answer.
                  </p>

                </div>

                {/* System */}

                <div className="relative overflow-hidden rounded-[22px] border border-blue-400/10 bg-gradient-to-br from-blue-500/[0.06] to-transparent p-5">

                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-400/[0.08] blur-3xl" />

                  <div className="relative flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-300/[0.05]">

                      <BrainCircuit
                        size={17}
                        className="text-blue-300"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-white/75">
                        Adaptive AI
                      </p>

                      <p className="mt-0.5 text-[10px] text-white/25">
                        Context-aware evaluation
                      </p>

                    </div>

                  </div>

                  <div className="relative mt-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">

                    <span className="relative flex h-1.5 w-1.5">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />

                      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                    </span>

                    System operational

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </main>

      {/* ====================================== */}
      {/* Answer input */}
      {/* ====================================== */}

      <div className="relative z-30 shrink-0">

        <div className="pointer-events-none absolute inset-x-0 bottom-full h-24 bg-gradient-to-t from-[#05070a] to-transparent" />

        <InterviewInput
          onSend={
            sendAnswer
          }
        />

      </div>

      {/* ====================================== */}
      {/* Bottom status */}
      {/* ====================================== */}

      <div className="pointer-events-none fixed bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/15 xl:flex">

        <span className="h-px w-8 bg-white/[0.08]" />

        AI Interview Agent

        <span className="h-px w-8 bg-white/[0.08]" />

      </div>

      {/* ====================================== */}
      {/* Local animation */}
      {/* ====================================== */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

// ==========================================
// Score item
// ==========================================

function ScoreItem({
  label,
  value,
}) {
  const safeValue =
    Number.isFinite(
      Number(value)
    )
      ? Number(value)
      : 0;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3 text-center transition-all duration-300 hover:border-blue-400/15 hover:bg-blue-400/[0.025]">

      <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
        {safeValue}
        <span className="text-[10px] text-white/20">
          /10
        </span>
      </p>

    </div>
  );
}