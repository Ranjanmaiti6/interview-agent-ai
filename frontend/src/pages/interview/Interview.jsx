import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Mic,
  MicOff,
  ShieldCheck,
  Sparkles,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

const QUESTIONS = [
  {
    id: 1,
    category: "Introduction",
    question:
      "Tell me about yourself and briefly describe your professional background.",
  },
  {
    id: 2,
    category: "Technical",
    question:
      "Describe a challenging technical problem you have solved and explain how you approached it.",
  },
  {
    id: 3,
    category: "Problem Solving",
    question:
      "How do you approach debugging when an application behaves unexpectedly in production?",
  },
  {
    id: 4,
    category: "Architecture",
    question:
      "How would you design a scalable web application that needs to support a rapidly growing number of users?",
  },
  {
    id: 5,
    category: "Experience",
    question:
      "Tell me about a project where you had to make an important technical decision under time pressure.",
  },
  {
    id: 6,
    category: "Engineering",
    question:
      "What practices do you follow to keep your code maintainable and reliable?",
  },
  {
    id: 7,
    category: "Behavioral",
    question:
      "Describe a situation where you disagreed with a technical decision made by your team.",
  },
  {
    id: 8,
    category: "Closing",
    question:
      "Why do you believe you would be a strong fit for this role?",
  },
];

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // Navigation / user information
  // ==========================================

  const navigationState =
    location.state || {};

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const queryParams = useMemo(() => {
    return new URLSearchParams(
      location.search
    );
  }, [location.search]);

  const meetingId =
    navigationState.meetingId ||
    queryParams.get("meetingId") ||
    "";

  const candidateId =
    queryParams.get("id") ||
    navigationState.employeeRequestId ||
    navigationState.employeeEmail ||
    user.email ||
    "";

  const candidateName =
    navigationState.employeeName ||
    user.name ||
    "Candidate";

  const candidateEmail =
    navigationState.employeeEmail ||
    user.email ||
    "";

  const meetingTitle =
    navigationState.meetingTitle ||
    "AI Interview";

  // ==========================================
  // State
  // ==========================================

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [currentQuestionText, setCurrentQuestionText] =
    useState(QUESTIONS[0].question);

  const [answer, setAnswer] =
    useState("");

  const [answers, setAnswers] =
    useState([]);

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(45 * 60);

  const [isListening, setIsListening] =
    useState(false);

  const [isCameraOn, setIsCameraOn] =
    useState(true);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showEndModal, setShowEndModal] =
    useState(false);

  const [transcriptSupported, setTranscriptSupported] =
    useState(true);

  const [reportId, setReportId] =
    useState("");

  // ==========================================
  // Refs
  // ==========================================

  const recognitionRef =
    useRef(null);

  const videoRef =
    useRef(null);

  const streamRef =
    useRef(null);

  // ==========================================
  // Current question
  // ==========================================

  const currentQuestion =
    QUESTIONS[questionIndex];

  const progress =
    ((questionIndex + 1) /
      QUESTIONS.length) *
    100;

  // ==========================================
  // Format time
  // ==========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ==========================================
  // Stop camera
  // ==========================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ==========================================
  // Stop speech recognition
  // ==========================================

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }

    setIsListening(false);
  };

  // ==========================================
  // Stop AI voice
  // ==========================================

  const stopSpeaking = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // ==========================================
  // Cleanup everything
  // ==========================================

  const cleanupInterviewMedia = () => {
    stopListening();
    stopSpeaking();
    stopCamera();
  };

  // ==========================================
  // Camera
  // ==========================================

  useEffect(() => {
    if (!started || finished) {
      return;
    }

    let active = true;

    const startCamera = async () => {
      try {
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          setIsCameraOn(false);
          return;
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: false,
            }
          );

        if (!active) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;
        }
      } catch (cameraError) {
        console.warn(
          "Camera unavailable:",
          cameraError
        );

        setIsCameraOn(false);
      }
    };

    startCamera();

    return () => {
      active = false;
    };
  }, [started, finished]);

  // ==========================================
  // Cleanup
  // ==========================================

  useEffect(() => {
    return () => {
      cleanupInterviewMedia();
    };
  }, []);

  // ==========================================
  // Timer
  // ==========================================

  useEffect(() => {
    if (!started || finished) {
      return;
    }

    if (timeLeft <= 0) {
      setShowEndModal(true);
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    started,
    finished,
    timeLeft,
  ]);

  // ==========================================
  // Speech recognition
  // ==========================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscriptSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (
      event
    ) => {
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0]
            .transcript;

        if (
          event.results[i].isFinal
        ) {
          finalText += transcript;
        }
      }

      if (finalText.trim()) {
        setAnswer((previous) => {
          const separator =
            previous.trim()
              ? " "
              : "";

          return (
            previous.trim() +
            separator +
            finalText.trim()
          );
        });
      }
    };

    recognition.onerror = (
      event
    ) => {
      console.warn(
        "Speech recognition:",
        event.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore
      }
    };
  }, []);

  // ==========================================
  // Start interview
  // ==========================================

  const startInterview = () => {
    setStarted(true);
    setFinished(false);
    setError("");
    setMessage("");

    const firstQuestion =
      QUESTIONS[0].question;

    setCurrentQuestionText(
      firstQuestion
    );

    window.setTimeout(() => {
      speakQuestion(
        firstQuestion
      );
    }, 200);
  };

  // ==========================================
  // AI voice
  // ==========================================

  const speakQuestion = (text) => {
    if (
      typeof window ===
        "undefined" ||
      !window.speechSynthesis ||
      !text
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 0.85;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  };

  // ==========================================
  // Toggle speech recognition
  // ==========================================

  const toggleListening = () => {
    if (
      !recognitionRef.current ||
      !transcriptSupported
    ) {
      setMessage(
        "Voice transcription is not supported by this browser."
      );

      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      recognitionRef.current.start();

      setIsListening(true);
      setMessage("");
      setError("");
    } catch (speechError) {
      console.warn(
        "Speech start error:",
        speechError
      );

      setIsListening(false);

      setMessage(
        "Unable to start the microphone. Please try again."
      );
    }
  };

  // ==========================================
  // Toggle camera
  // ==========================================

  const toggleCamera = () => {
    const nextValue =
      !isCameraOn;

    setIsCameraOn(nextValue);

    if (streamRef.current) {
      streamRef.current
        .getVideoTracks()
        .forEach((track) => {
          track.enabled =
            nextValue;
        });
    }
  };

  // ==========================================
  // Submit answer
  // ==========================================

  const submitAnswer = async () => {
    const cleanAnswer =
      answer.trim();

    if (!cleanAnswer) {
      setError(
        "Please provide an answer before continuing."
      );

      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    stopListening();

    const answerItem = {
      questionId:
        currentQuestion.id,

      category:
        currentQuestion.category,

      question:
        currentQuestionText,

      answer:
        cleanAnswer,
    };

    const updatedAnswers = [
      ...answers,
      answerItem,
    ];

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      // ======================================
      // SEND ANSWER TO BACKEND
      // ======================================

      const response =
        await fetch(
          `${API_URL}/api/interview/answer`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              answer:
                cleanAnswer,

              questionNumber:
                currentQuestion.id,

              candidateId:
                candidateId ||
                null,

              meetingId:
                meetingId ||
                null,

              employeeEmail:
                candidateEmail ||
                null,
            }),
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (
        response.status ===
        401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            `Unable to submit interview answer. HTTP ${response.status}`
        );
      }

      // ======================================
      // Save answer
      // ======================================

      setAnswers(
        updatedAnswers
      );

      setAnswer("");

      // ======================================
      // Save report ID
      // ======================================

      if (data.reportId) {
        setReportId(
          String(data.reportId)
        );
      }

      // ======================================
      // Final question
      // ======================================

      if (
        questionIndex >=
        QUESTIONS.length - 1
      ) {
        setMessage(
          "Interview completed. Your report has been saved."
        );

        cleanupInterviewMedia();

        setFinished(true);

        return;
      }

      // ======================================
      // Next question
      // ======================================

      const nextIndex =
        questionIndex + 1;

      const backendNextQuestion =
        typeof data.nextQuestion ===
        "string"
          ? data.nextQuestion.trim()
          : "";

      const nextQuestion =
        backendNextQuestion ||
        QUESTIONS[nextIndex].question;

      setQuestionIndex(
        nextIndex
      );

      setCurrentQuestionText(
        nextQuestion
      );

      window.setTimeout(() => {
        speakQuestion(
          nextQuestion
        );
      }, 250);
    } catch (submitError) {
      console.error(
        "Submit interview answer error:",
        submitError
      );

      setError(
        submitError.message ||
          "Unable to submit your answer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Finish interview early
  //
  // IMPORTANT:
  // We do NOT call:
  // /api/interviews/complete
  //
  // Your current backend doesn't have that
  // endpoint.
  //
  // Reports are already saved by:
  // /api/interview/answer
  // ==========================================

  const finishInterview = (
    finalAnswers
  ) => {
    cleanupInterviewMedia();

    setAnswers(
      finalAnswers || []
    );

    setFinished(true);
    setShowEndModal(false);
    setError("");
    setMessage("");
  };

  // ==========================================
  // End early
  // ==========================================

  const endInterviewEarly = () => {
    if (submitting) {
      return;
    }

    setShowEndModal(false);

    if (answers.length === 0) {
      cleanupInterviewMedia();

      setFinished(true);

      return;
    }

    finishInterview(
      answers
    );
  };

  // ==========================================
  // View report
  // ==========================================

  const openReport = () => {
    /*
     * Your current App.jsx has:
     *
     * /report
     *
     * and your Report component loads:
     *
     * /api/reports/latest
     *
     * so /report is the safest route here.
     */

    navigate("/report");
  };

  // ==========================================
  // Finished screen
  // ==========================================

  if (finished) {
    return (
      <FinishedScreen
        candidateName={
          candidateName
        }
        answers={answers}
        reportId={reportId}
        onReport={
          openReport
        }
        navigate={
          navigate
        }
      />
    );
  }

  // ==========================================
  // Intro screen
  // ==========================================

  if (!started) {
    return (
      <IntroScreen
        candidateName={
          candidateName
        }
        meetingTitle={
          meetingTitle
        }
        onStart={
          startInterview
        }
        onBack={() =>
          navigate(
            "/meetings"
          )
        }
      />
    );
  }

  // ==========================================
  // Interview workspace
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040609] text-white">
      <AmbientBackground />

      {/* Top line */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ========================================
          Header
      ======================================== */}

      <header className="relative z-30 border-b border-white/[0.06] bg-[#06080c]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/[0.07]">
              <BrainCircuit
                size={20}
                strokeWidth={1.4}
                className="text-blue-300"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-300/65">
                AI Interview
              </p>

              <p className="mt-0.5 text-sm font-semibold text-white">
                {meetingTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}

            <div
              className={`hidden items-center gap-2 rounded-full border px-3.5 py-2 sm:flex ${
                timeLeft <
                5 * 60
                  ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
                  : "border-white/[0.07] bg-white/[0.025] text-white/45"
              }`}
            >
              <Clock3 size={13} />

              <span className="font-mono text-[11px] font-semibold">
                {formatTime(
                  timeLeft
                )}
              </span>
            </div>

            {/* End */}

            <button
              type="button"
              onClick={() =>
                setShowEndModal(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.025] px-3.5 py-2.5 text-xs font-semibold text-red-300/70 transition-all duration-300 hover:border-red-400/25 hover:bg-red-400/[0.06] hover:text-red-300"
            >
              <XCircle size={14} />

              <span className="hidden sm:inline">
                End Interview
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================
          Progress
      ======================================== */}

      <div className="relative z-20 border-b border-white/[0.05] bg-[#06080c]/60">
        <div className="mx-auto max-w-[1500px] px-5 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Question
              </span>

              <span className="font-mono text-xs font-semibold text-white/65">
                {String(
                  questionIndex + 1
                ).padStart(
                  2,
                  "0"
                )}

                {" "}

                <span className="text-white/20">
                  /
                </span>

                {" "}

                {String(
                  QUESTIONS.length
                ).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-300/50">
              {currentQuestion.category}
            </span>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================
          Main workspace
      ======================================== */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          {/* ====================================
              Main interviewer panel
          ==================================== */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.018] shadow-[0_35px_120px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.045] blur-[120px]" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* AI identity */}

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-xl border ${
                      isSpeaking
                        ? "border-blue-300/30 bg-blue-500/[0.12] shadow-[0_0_35px_rgba(37,99,235,0.18)]"
                        : "border-blue-300/10 bg-blue-500/[0.06]"
                    }`}
                  >
                    <BrainCircuit
                      size={20}
                      className="text-blue-300"
                    />

                    {isSpeaking && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-blue-400" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white/75">
                      AI Interviewer
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/25">
                      Adaptive technical assessment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.17em] text-emerald-300/60">
                    Live
                  </span>
                </div>
              </div>

              {/* Question */}

              <div className="mt-10 min-h-[360px] rounded-[26px] border border-white/[0.06] bg-[#06090e] p-7 sm:p-9 lg:p-12">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-blue-300"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/55">
                    Current question
                  </span>
                </div>

                <h1 className="mt-8 max-w-4xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                  {
                    currentQuestionText
                  }
                </h1>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      speakQuestion(
                        currentQuestionText
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/45 transition-all duration-300 hover:border-blue-300/15 hover:bg-blue-400/[0.05] hover:text-blue-200"
                  >
                    {isSpeaking ? (
                      <Volume2
                        size={14}
                      />
                    ) : (
                      <VolumeX
                        size={14}
                      />
                    )}

                    {isSpeaking
                      ? "Speaking..."
                      : "Read question"}
                  </button>

                  <span className="text-[9px] uppercase tracking-[0.17em] text-white/15">
                    Take your time
                  </span>
                </div>
              </div>

              {/* Answer */}

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                      Your response
                    </p>
                  </div>

                  {isListening && (
                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-red-300/70">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />

                        <span className="relative h-2 w-2 rounded-full bg-red-400" />
                      </span>

                      Listening
                    </div>
                  )}
                </div>

                <textarea
                  value={answer}
                  onChange={(event) =>
                    setAnswer(
                      event.target.value
                    )
                  }
                  placeholder="Type your answer or use the microphone..."
                  rows={7}
                  className="w-full resize-none rounded-[22px] border border-white/[0.08] bg-black/25 px-5 py-5 text-sm leading-7 text-white outline-none transition-all duration-300 placeholder:text-white/15 focus:border-blue-400/25 focus:bg-blue-400/[0.018] focus:ring-4 focus:ring-blue-500/[0.04]"
                />

                {error && (
                  <div className="mt-3 rounded-xl border border-red-400/10 bg-red-400/[0.035] px-4 py-3 text-xs text-red-300/80">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mt-3 rounded-xl border border-blue-400/10 bg-blue-400/[0.035] px-4 py-3 text-xs text-blue-300/70">
                    {message}
                  </div>
                )}

                {/* Controls */}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    {/* Microphone */}

                    <button
                      type="button"
                      onClick={
                        toggleListening
                      }
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                        isListening
                          ? "border-red-400/25 bg-red-400/[0.08] text-red-300"
                          : "border-white/[0.08] bg-white/[0.025] text-white/45 hover:border-blue-300/20 hover:bg-blue-400/[0.05] hover:text-blue-200"
                      }`}
                      title={
                        isListening
                          ? "Stop microphone"
                          : "Start microphone"
                      }
                    >
                      {isListening ? (
                        <MicOff
                          size={17}
                        />
                      ) : (
                        <Mic
                          size={17}
                        />
                      )}
                    </button>

                    {/* Camera */}

                    <button
                      type="button"
                      onClick={
                        toggleCamera
                      }
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                        isCameraOn
                          ? "border-white/[0.08] bg-white/[0.025] text-white/45 hover:border-blue-300/20 hover:bg-blue-400/[0.05] hover:text-blue-200"
                          : "border-red-400/15 bg-red-400/[0.05] text-red-300"
                      }`}
                      title={
                        isCameraOn
                          ? "Turn camera off"
                          : "Turn camera on"
                      }
                    >
                      {isCameraOn ? (
                        <Video
                          size={17}
                        />
                      ) : (
                        <VideoOff
                          size={17}
                        />
                      )}
                    </button>
                  </div>

                  {/* Submit */}

                  <button
                    type="button"
                    onClick={
                      submitAnswer
                    }
                    disabled={
                      submitting
                    }
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_35px_rgba(37,99,235,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_15px_45px_rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? (
                      <>
                        Processing...
                      </>
                    ) : questionIndex ===
                      QUESTIONS.length -
                        1 ? (
                      <>
                        Finish Interview

                        <CheckCircle2
                          size={15}
                        />
                      </>
                    ) : (
                      <>
                        Submit Answer

                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================
              Right sidebar
          ==================================== */}

          <aside className="space-y-6">
            {/* Camera preview */}

            <div className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.018] shadow-[0_25px_90px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#05080d]">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full scale-x-[-1] object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                        <VideoOff
                          size={23}
                          className="text-white/25"
                        />
                      </div>

                      <p className="mt-4 text-xs text-white/30">
                        Camera disabled
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white/75">
                        {candidateName}
                      </p>

                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-white/35">
                        Candidate
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/30 px-2.5 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-white/40">
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview progress */}

            <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.21em] text-white/25">
                    Interview progress
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    {Math.round(
                      progress
                    )}

                    <span className="text-sm text-white/20">
                      %
                    </span>
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.05]">
                  <BrainCircuit
                    size={18}
                    className="text-blue-300"
                  />
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-4 gap-1.5">
                {QUESTIONS.map(
                  (
                    question,
                    index
                  ) => {
                    const completed =
                      answers.some(
                        (item) =>
                          item.questionId ===
                          question.id
                      );

                    const active =
                      index ===
                      questionIndex;

                    return (
                      <div
                        key={
                          question.id
                        }
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          completed
                            ? "bg-emerald-400"
                            : active
                            ? "bg-blue-400"
                            : "bg-white/[0.07]"
                        }`}
                      />
                    );
                  }
                )}
              </div>
            </div>

            {/* Security */}

            <div className="rounded-[24px] border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-300/70"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-emerald-300/75">
                    Secure assessment
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/25">
                    Your interview session is
                    protected by your authenticated
                    account.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ========================================
          End interview modal
      ======================================== */}

      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-md">
          <div
            className="absolute inset-0"
            onClick={() =>
              setShowEndModal(
                false
              )
            }
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#080c12] p-7 shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
            <div className="pointer-events-none absolute left-1/2 top-[-100px] h-52 w-72 -translate-x-1/2 rounded-full bg-red-500/[0.06] blur-[80px]" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.06]">
                <XCircle
                  size={21}
                  className="text-red-300"
                />
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">
                End interview?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Your completed answers are already
                saved. Ending now will stop the current
                interview session.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowEndModal(
                      false
                    )
                  }
                  className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={
                    endInterviewEarly
                  }
                  disabled={
                    submitting
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                >
                  End Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Intro screen
// ==========================================

function IntroScreen({
  candidateName,
  meetingTitle,
  onStart,
  onBack,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040609] text-white">
      <AmbientBackground />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      <header className="relative z-20 border-b border-white/[0.06] bg-[#06080c]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
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
                Secure Assessment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/10 bg-blue-400/[0.04] px-3 py-1.5">
              <Sparkles
                size={12}
                className="text-blue-300"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300/65">
                AI-powered interview
              </span>
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Ready for your
              <span className="text-white/35">
                {" "}
                interview.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
              Welcome,{" "}
              <span className="text-white/65">
                {candidateName}
              </span>
              . You are about to enter an adaptive
              AI interview designed to evaluate your
              technical reasoning, experience, and
              problem-solving ability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Feature
                icon={BrainCircuit}
                text="Adaptive questions"
              />

              <Feature
                icon={Clock3}
                text="45 minute session"
              />

              <Feature
                icon={ShieldCheck}
                text="Secure workspace"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/[0.07] blur-[90px]" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border border-blue-300/15 bg-blue-500/[0.07] shadow-[0_0_70px_rgba(37,99,235,0.12)]">
                <BrainCircuit
                  size={33}
                  strokeWidth={1.2}
                  className="text-blue-300"
                />
              </div>

              <div className="mt-7 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/55">
                  Session
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                  {meetingTitle}
                </h2>

                <p className="mt-3 text-xs leading-5 text-white/30">
                  Make sure your camera and microphone are
                  available before beginning.
                </p>
              </div>

              <div className="mt-7 space-y-3">
                <CheckItem text="Answer each question clearly" />
                <CheckItem text="Speak naturally and explain your reasoning" />
                <CheckItem text="You can use the microphone for transcription" />
                <CheckItem text="Do not close the interview window" />
              </div>

              <button
                type="button"
                onClick={onStart}
                className="group mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_18px_50px_rgba(37,99,235,0.3)]"
              >
                Start Interview

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>

              <div className="mt-5 flex items-center justify-center gap-2">
                <LockIcon />

                <span className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Secure authenticated session
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Finished screen
// ==========================================

function FinishedScreen({
  candidateName,
  answers,
  reportId,
  onReport,
  navigate,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040609] px-5 text-white">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/[0.08] bg-white/[0.02] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border border-emerald-400/15 bg-emerald-400/[0.06] shadow-[0_0_70px_rgba(16,185,129,0.1)]">
          <CheckCircle2
            size={35}
            className="text-emerald-300"
          />
        </div>

        <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-300/60">
          Interview complete
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
          Great work,{" "}
          <span className="text-white/40">
            {candidateName}.
          </span>
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/35">
          Your interview responses have been recorded
          and your evaluation report has been saved.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06]">
          <div className="bg-black/20 p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
              Questions answered
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {answers.length}
            </p>
          </div>

          <div className="bg-black/20 p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
              Status
            </p>

            <p className="mt-2 text-lg font-semibold text-emerald-300">
              Submitted
            </p>
          </div>
        </div>

        {reportId && (
          <p className="mt-4 text-[9px] font-mono uppercase tracking-[0.14em] text-white/15">
            Report saved
          </p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onReport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
          >
            View Report
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/employee"
              )
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3.5 text-sm font-semibold text-white/50 transition hover:bg-white/[0.05] hover:text-white"
          >
            Dashboard
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Feature
// ==========================================

function Feature({
  icon: Icon,
  text,
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2">
      <Icon
        size={12}
        className="text-blue-300/70"
      />

      <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30">
        {text}
      </span>
    </div>
  );
}

// ==========================================
// Check item
// ==========================================

function CheckItem({
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.018] px-4 py-3">
      <CheckCircle2
        size={14}
        className="shrink-0 text-emerald-300/65"
      />

      <span className="text-xs text-white/40">
        {text}
      </span>
    </div>
  );
}

// ==========================================
// Lock icon
// ==========================================

function LockIcon() {
  return (
    <ShieldCheck
      size={12}
      className="text-emerald-300/50"
    />
  );
}

// ==========================================
// Ambient background
// ==========================================

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute left-[-12%] top-[-18%] h-[560px] w-[560px] rounded-full bg-blue-500/[0.045] blur-[170px]" />

      <div className="absolute right-[-14%] top-[15%] h-[520px] w-[520px] rounded-full bg-purple-500/[0.025] blur-[160px]" />

      <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.02] blur-[160px]" />

      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize:
            "34px 34px",
        }}
      />
    </div>
  );
}