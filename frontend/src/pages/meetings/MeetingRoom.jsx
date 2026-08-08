import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
  Video,
  XCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

export default function MeetingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

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

  // ==========================================
  // Load meeting
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadMeeting = async () => {
      try {
        if (!id) {
          throw new Error(
            "Meeting ID is missing."
          );
        }

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/meetings/${encodeURIComponent(
            id
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
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
              `Unable to load meeting. HTTP ${response.status}`
          );
        }

        if (!data.meeting) {
          throw new Error(
            "Meeting was not returned by the server."
          );
        }

        if (!cancelled) {
          setMeeting(data.meeting);
        }
      } catch (err) {
        console.error(
          "Load meeting error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load meeting."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMeeting();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  // ==========================================
  // Join meeting
  // ==========================================

  const handleJoin = () => {
    if (!meeting || joining) {
      return;
    }

    setJoining(true);

    if (meeting.meeting_url) {
      window.open(
        meeting.meeting_url,
        "_blank",
        "noopener,noreferrer"
      );

      setJoining(false);
      return;
    }

    const candidateId =
      meeting.employee_request_id ||
      meeting.employee_email ||
      meeting.id;

    navigate(
      `/interview?id=${encodeURIComponent(
        candidateId
      )}`,
      {
        state: {
          meetingId: meeting.id,
          employeeEmail:
            meeting.employee_email,
          employeeName:
            meeting.employee_name ||
            user.name ||
            "Employee",
          meetingTitle:
            meeting.title ||
            "AI Interview",
        },
      }
    );

    setJoining(false);
  };

  // ==========================================
  // Helpers
  // ==========================================

  const formatDate = (value) => {
    if (!value) {
      return "Not scheduled";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getStatus = (value) => {
    const status = String(
      value || "scheduled"
    ).toLowerCase();

    if (status === "completed") {
      return {
        label: "Completed",
        icon: CheckCircle2,
        classes:
          "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300",
      };
    }

    if (
      status === "cancelled" ||
      status === "canceled"
    ) {
      return {
        label: "Cancelled",
        icon: XCircle,
        classes:
          "border-red-400/15 bg-red-400/[0.05] text-red-300",
      };
    }

    return {
      label: "Scheduled",
      icon: CalendarDays,
      classes:
        "border-blue-400/15 bg-blue-400/[0.05] text-blue-300",
    };
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-white">
        <AmbientBackground />

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/[0.07] shadow-[0_0_60px_rgba(37,99,235,0.12)]">
            <Loader2
              size={26}
              className="animate-spin text-blue-300"
            />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-300/60">
            Secure interview room
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
            Preparing your session
          </h1>

          <p className="mt-2 text-sm text-white/30">
            Loading meeting information...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-white">
        <AmbientBackground />

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-8 text-center shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.06]">
            <XCircle
              size={26}
              className="text-red-300"
            />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300/60">
            Meeting unavailable
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
            Unable to open meeting
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/35">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/meetings")
            }
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
          >
            <ArrowLeft size={15} />
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return null;
  }

  const hasExternalMeeting =
    Boolean(meeting.meeting_url);

  const statusConfig =
    getStatus(
      meeting.status
    );

  const StatusIcon =
    statusConfig.icon;

  const isCompleted =
    String(
      meeting.status || ""
    ).toLowerCase() ===
    "completed";

  const isCancelled =
    ["cancelled", "canceled"].includes(
      String(
        meeting.status || ""
      ).toLowerCase()
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      <AmbientBackground />

      {/* ==========================================
          Top line
      ========================================== */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ==========================================
          Header
      ========================================== */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#06080c]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          {/* Brand */}

          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/[0.07]">
              <Video
                size={19}
                strokeWidth={1.5}
                className="text-blue-300"
              />

              <span className="absolute inset-0 rounded-xl bg-blue-400/[0.05] blur-xl" />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-300/70">
                Interview Room
              </p>

              <p className="mt-0.5 text-sm font-semibold text-white">
                Secure Session
              </p>
            </div>
          </div>

          {/* Session indicator */}

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2 sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-300/60">
                Session ready
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/meetings")
              }
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-semibold text-white/45 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft size={14} />

              <span className="hidden sm:inline">
                Meetings
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          Main
      ========================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* ========================================
            Hero
        ======================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.018] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-24 -top-32 h-[360px] w-[360px] rounded-full bg-blue-500/[0.07] blur-[110px]" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[25%] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.025] blur-[100px]" />

          <div className="relative">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-blue-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-400">
                    Scheduled Interview
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                  {meeting.title ||
                    "AI Interview"}
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                  Your interview session is prepared.
                  Review the details below before
                  entering the secure interview
                  workspace.
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.17em] ${statusConfig.classes}`}
              >
                <StatusIcon size={12} />

                {statusConfig.label}
              </div>
            </div>

            {/* Meeting metadata */}

            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-3">
              <MeetingMeta
                icon={CalendarDays}
                label="Scheduled"
                value={formatDate(
                  meeting.scheduled_at
                )}
              />

              <MeetingMeta
                icon={Clock3}
                label="Duration"
                value={`${meeting.duration_minutes || 30} minutes`}
              />

              <MeetingMeta
                icon={User}
                label="Candidate"
                value={
                  meeting.employee_name ||
                  user.name ||
                  "Employee"
                }
              />
            </div>
          </div>
        </section>

        {/* ========================================
            Main workspace
        ======================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left - session preview */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018] shadow-[0_25px_90px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-64 w-64 rounded-full bg-blue-500/[0.055] blur-[90px]" />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.23em] text-blue-300/60">
                    Interview workspace
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    Ready when you are.
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                  <Sparkles
                    size={17}
                    className="text-blue-300"
                  />
                </div>
              </div>

              {/* Visual stage */}

              <div className="relative mt-7 min-h-[300px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#06090e]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.12),transparent_38%)]" />

                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                    backgroundSize:
                      "42px 42px",
                  }}
                />

                <div className="relative flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-blue-300/15 bg-blue-500/[0.07] shadow-[0_0_80px_rgba(37,99,235,0.15)]">
                    <div className="absolute inset-2 rounded-[22px] border border-blue-300/10" />

                    <Video
                      size={35}
                      strokeWidth={1.2}
                      className="text-blue-300"
                    />
                  </div>

                  <p className="mt-7 text-sm font-semibold text-white/75">
                    {hasExternalMeeting
                      ? "External meeting ready"
                      : "AI interview ready"}
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-white/25">
                    {hasExternalMeeting
                      ? "The meeting link will open securely in a new browser tab."
                      : "Your AI interview workspace will open when you start the session."}
                  </p>

                  <div className="mt-6 flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
                    <Lock
                      size={11}
                      className="text-emerald-300/70"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                      Secure session
                    </span>
                  </div>
                </div>
              </div>

              {/* Join button */}

              {!isCompleted &&
                !isCancelled && (
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={joining}
                    className="group mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_18px_50px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {joining ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Opening session...
                      </>
                    ) : (
                      <>
                        {hasExternalMeeting
                          ? "Join Meeting"
                          : "Start AI Interview"}

                        {hasExternalMeeting ? (
                          <ExternalLink
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        ) : (
                          <ArrowUpRight
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        )}
                      </>
                    )}
                  </button>
                )}

              {isCompleted && (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-5 py-3.5 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 size={16} />
                  Interview completed
                </div>
              )}

              {isCancelled && (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-5 py-3.5 text-sm font-semibold text-red-300">
                  <XCircle size={16} />
                  Meeting cancelled
                </div>
              )}
            </div>
          </div>

          {/* Right - details */}

          <div className="space-y-6">
            {/* Candidate card */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-6 shadow-[0_25px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.04] blur-[70px]" />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <User
                    size={15}
                    className="text-blue-300"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/65">
                    Candidate profile
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/[0.07] text-lg font-semibold text-blue-200">
                    {(
                      meeting.employee_name ||
                      user.name ||
                      "E"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white/85">
                      {meeting.employee_name ||
                        user.name ||
                        "Employee"}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/30">
                      {meeting.employee_email ||
                        user.email ||
                        "Employee account"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-6 shadow-[0_25px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-2">
                <FileText
                  size={15}
                  className="text-blue-300"
                />

                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/65">
                  Session brief
                </p>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/35">
                {meeting.description ||
                  "No additional instructions have been provided for this interview."}
              </p>
            </div>

            {/* Security */}

            <div className="rounded-[24px] border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-300/75"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-emerald-300/75">
                    Secure interview workflow
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/25">
                    Access is protected by your
                    authenticated session. Only
                    authorized participants can enter
                    this meeting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            Footer
        ======================================== */}

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
              Interview system operational
            </span>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/10">
            Session / {meeting.id}
          </p>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Ambient background
// ==========================================

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute left-[-10%] top-[-18%] h-[540px] w-[540px] rounded-full bg-blue-500/[0.045] blur-[160px]" />

      <div className="absolute right-[-12%] top-[20%] h-[520px] w-[520px] rounded-full bg-purple-500/[0.025] blur-[160px]" />

      <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.02] blur-[160px]" />

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

// ==========================================
// Meeting metadata
// ==========================================

function MeetingMeta({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-black/20 p-5">
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="text-blue-300/70"
        />

        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium leading-6 text-white/65">
        {value}
      </p>
    </div>
  );
}