import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X,
  XCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [meetingTitle, setMeetingTitle] =
    useState("AI Interview");

  const [meetingDescription, setMeetingDescription] =
    useState("");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [durationMinutes, setDurationMinutes] =
    useState("30");

  const [scheduling, setScheduling] =
    useState(false);

  const [scheduleMessage, setScheduleMessage] =
    useState("");

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login?role=admin");
  };

  // ==========================================
  // Load employee requests
  // ==========================================

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/employee/requests`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load requests."
        );
      }

      setRequests(
        data.requests || []
      );
    } catch (error) {
      console.error(
        "Load requests error:",
        error
      );

      setError(
        error.message ||
          "Unable to load employee requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // Update request status
  // ==========================================

  const updateRequestStatus = async (
    requestId,
    status
  ) => {
    try {
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/employee/requests/${requestId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update request."
        );
      }

      await loadRequests();
    } catch (error) {
      console.error(
        "Update request error:",
        error
      );

      setError(
        error.message ||
          "Unable to update request."
      );
    }
  };

  // ==========================================
  // Open schedule modal
  // ==========================================

  const openScheduleModal = (
    request
  ) => {
    setSelectedRequest(request);

    setMeetingTitle(
      "AI Interview"
    );

    setMeetingDescription("");

    setScheduledAt("");

    setDurationMinutes("30");

    setScheduleMessage("");
  };

  // ==========================================
  // Close schedule modal
  // ==========================================

  const closeScheduleModal = () => {
    if (scheduling) {
      return;
    }

    setSelectedRequest(null);
    setScheduleMessage("");
  };

  // ==========================================
  // Schedule meeting
  // ==========================================

  const scheduleMeeting = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedRequest) {
      return;
    }

    if (!scheduledAt) {
      setScheduleMessage(
        "Please select a date and time."
      );

      return;
    }

    if (!selectedRequest.email) {
      setScheduleMessage(
        "Employee email is missing from the request."
      );

      return;
    }

    try {
      setScheduling(true);
      setScheduleMessage("");
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication token is missing. Please log in again."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/meetings`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              employeeRequestId:
                selectedRequest.id,

              employeeName:
                selectedRequest.name ||
                "Employee",

              employeeEmail:
                selectedRequest.email,

              title:
                meetingTitle.trim() ||
                "AI Interview",

              description:
                meetingDescription.trim(),

              scheduledAt,

              durationMinutes:
                Number(
                  durationMinutes
                ) || 30,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to schedule meeting."
        );
      }

      setScheduleMessage(
        "Meeting scheduled successfully."
      );

      await loadRequests();

      setTimeout(() => {
        setSelectedRequest(null);
        setScheduleMessage("");
      }, 1000);
    } catch (error) {
      console.error(
        "Schedule meeting error:",
        error
      );

      setScheduleMessage(
        error.message ||
          "Unable to schedule meeting."
      );
    } finally {
      setScheduling(false);
    }
  };

  // ==========================================
  // Derived statistics
  // ==========================================

  const pendingCount =
    requests.filter(
      (request) =>
        (request.status || "pending") ===
        "pending"
    ).length;

  const acceptedCount =
    requests.filter(
      (request) =>
        request.status === "accepted"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        request.status === "rejected"
    ).length;

  const scoredRequests =
    requests.filter(
      (request) =>
        request.aiScore !== null &&
        request.aiScore !== undefined
    );

  const averageScore =
    scoredRequests.length > 0
      ? Math.round(
          scoredRequests.reduce(
            (sum, request) =>
              sum +
              Number(
                request.aiScore || 0
              ),
            0
          ) /
            scoredRequests.length
        )
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* ========================================= */}
      {/* Ambient environment */}
      {/* ========================================= */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-12%] top-[-15%] h-[550px] w-[550px] rounded-full bg-blue-500/[0.045] blur-[160px]" />

        <div className="absolute right-[-12%] top-[20%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.035] blur-[150px]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[160px]" />

        <div className="absolute inset-0 opacity-[0.018] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] [background-size:34px_34px]" />
      </div>

      {/* Top cinematic line */}

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ========================================= */}
      {/* Header */}
      {/* ========================================= */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#05070a]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-400/[0.05]">
              <ShieldCheck
                size={21}
                strokeWidth={1.5}
                className="text-blue-300"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-300/60">
                Control Center
              </p>

              <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.025em] text-white">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-4
              py-2.5
              text-xs
              font-medium
              text-white/50
              transition-all
              duration-300
              hover:border-red-400/20
              hover:bg-red-400/[0.05]
              hover:text-red-300
            "
          >
            <LogOut
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />

            Logout
          </button>
        </div>
      </header>

      {/* ========================================= */}
      {/* Main */}
      {/* ========================================= */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero */}

        <section className="border-b border-white/[0.07] pb-9">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-blue-400" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-300">
              Administration
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl md:text-6xl">
                Welcome,
                <span className="text-white/30">
                  {" "}
                  {user.name || "Admin"}
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                Manage employee interview requests, schedule technical
                interviews and review AI-powered assessment intelligence.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
                System operational
              </span>
            </div>
          </div>
        </section>

        {/* ===================================== */}
        {/* Metrics */}
        {/* ===================================== */}

        <section className="mt-7 grid gap-px overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total requests"
            value={requests.length}
            icon={Users}
            accent="blue"
          />

          <MetricCard
            label="Pending review"
            value={pendingCount}
            icon={Clock3}
            accent="amber"
          />

          <MetricCard
            label="Accepted"
            value={acceptedCount}
            icon={CheckCircle2}
            accent="emerald"
          />

          <MetricCard
            label="Average AI score"
            value={
              averageScore !== null
                ? averageScore
                : "—"
            }
            icon={Activity}
            accent="violet"
            suffix={
              averageScore !== null
                ? "/100"
                : ""
            }
          />
        </section>

        {/* ===================================== */}
        {/* Quick actions */}
        {/* ===================================== */}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <QuickAction
            icon={Users}
            eyebrow="01 / Requests"
            title="Review interview requests"
            description={`${requests.length} candidate request${
              requests.length === 1
                ? ""
                : "s"
            } currently in the system.`}
            onClick={() =>
              document
                .getElementById(
                  "employee-requests"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            accent="blue"
          />

          <QuickAction
            icon={Video}
            eyebrow="02 / Meetings"
            title="Manage meetings"
            description="Schedule and manage candidate interview sessions."
            onClick={() =>
              navigate("/meetings")
            }
            accent="violet"
          />

          <QuickAction
            icon={Sparkles}
            eyebrow="03 / Intelligence"
            title="Open AI reports"
            description="Review interview scores and generated assessment reports."
            onClick={() =>
              navigate("/report")
            }
            accent="emerald"
          />
        </section>

        {/* ===================================== */}
        {/* Requests */}
        {/* ===================================== */}

        <section
          id="employee-requests"
          className="mt-12 scroll-mt-8"
        >
          <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-blue-400" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-300/70">
                  Employee Requests
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                Interview Requests
              </h2>

              <p className="mt-2 text-sm text-white/30">
                Review, approve and schedule candidate interviews.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="
                group
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                py-2.5
                text-xs
                font-medium
                text-white/55
                transition-all
                duration-300
                hover:border-white/[0.16]
                hover:bg-white/[0.05]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-300 group-hover:rotate-90"
                }
              />

              Refresh
            </button>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4 text-sm text-red-300">
              <XCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-medium">
                  Something went wrong
                </p>

                <p className="mt-1 text-xs text-red-300/60">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}

          {loading && (
            <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-[24px] border border-white/[0.07] bg-white/[0.02]">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.05]">
                  <Loader2
                    size={20}
                    className="animate-spin text-blue-300"
                  />
                </div>

                <p className="mt-4 text-sm text-white/50">
                  Loading employee requests
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/20">
                  Connecting to interview system
                </p>
              </div>
            </div>
          )}

          {/* Empty */}

          {!loading &&
            requests.length === 0 && (
              <div className="mt-6 overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.02]">
                <div className="relative flex min-h-[320px] items-center justify-center p-8 text-center">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.05] blur-[90px]" />

                  <div className="relative">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                      <Users
                        size={23}
                        strokeWidth={1.4}
                        className="text-white/35"
                      />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-white">
                      No employee requests
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/30">
                      New employee interview requests will appear here when
                      they are submitted.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Request list */}

          {!loading &&
            requests.length > 0 && (
              <div className="mt-6 space-y-4">
                {requests.map(
                  (request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onAccept={() =>
                        updateRequestStatus(
                          request.id,
                          "accepted"
                        )
                      }
                      onReject={() =>
                        updateRequestStatus(
                          request.id,
                          "rejected"
                        )
                      }
                      onSchedule={() =>
                        openScheduleModal(
                          request
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
        </section>

        {/* Footer system line */}

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
              AI Interview Agent / Administration
            </span>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/10">
            Requests / {requests.length}
          </span>
        </div>
      </main>

      {/* ========================================= */}
      {/* Schedule modal */}
      {/* ========================================= */}

      {selectedRequest && (
        <ScheduleModal
          request={selectedRequest}
          meetingTitle={meetingTitle}
          setMeetingTitle={setMeetingTitle}
          meetingDescription={
            meetingDescription
          }
          setMeetingDescription={
            setMeetingDescription
          }
          scheduledAt={scheduledAt}
          setScheduledAt={setScheduledAt}
          durationMinutes={
            durationMinutes
          }
          setDurationMinutes={
            setDurationMinutes
          }
          scheduling={scheduling}
          scheduleMessage={
            scheduleMessage
          }
          onClose={
            closeScheduleModal
          }
          onSubmit={
            scheduleMeeting
          }
        />
      )}
    </div>
  );
}

// ==========================================
// Metric card
// ==========================================

function MetricCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  accent = "blue",
}) {
  const accentStyles = {
    blue: {
      icon: "text-blue-300",
      bg: "bg-blue-400/[0.06]",
      border: "border-blue-400/10",
    },
    amber: {
      icon: "text-amber-300",
      bg: "bg-amber-400/[0.05]",
      border: "border-amber-400/10",
    },
    emerald: {
      icon: "text-emerald-300",
      bg: "bg-emerald-400/[0.05]",
      border: "border-emerald-400/10",
    },
    violet: {
      icon: "text-violet-300",
      bg: "bg-violet-400/[0.05]",
      border: "border-violet-400/10",
    },
  };

  const style =
    accentStyles[accent] ||
    accentStyles.blue;

  return (
    <div className="group relative overflow-hidden bg-[#080b10] p-6 transition-colors duration-500 hover:bg-[#0a0e14] sm:p-7">
      <div className="flex items-start justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/20">
          {label}
        </span>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${style.border} ${style.bg}`}
        >
          <Icon
            size={16}
            strokeWidth={1.5}
            className={style.icon}
          />
        </div>
      </div>

      <div className="mt-8">
        <span className="text-4xl font-semibold tracking-[-0.06em] text-white">
          {value}
        </span>

        {suffix && (
          <span className="ml-1 text-xs text-white/20">
            {suffix}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-400 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}

// ==========================================
// Quick action
// ==========================================

function QuickAction({
  icon: Icon,
  eyebrow,
  title,
  description,
  onClick,
  accent,
}) {
  const accentStyles = {
    blue: {
      icon: "text-blue-300",
      bg: "bg-blue-400/[0.05]",
      border: "border-blue-400/10",
    },
    violet: {
      icon: "text-violet-300",
      bg: "bg-violet-400/[0.05]",
      border: "border-violet-400/10",
    },
    emerald: {
      icon: "text-emerald-300",
      bg: "bg-emerald-400/[0.05]",
      border: "border-emerald-400/10",
    },
  };

  const style =
    accentStyles[accent] ||
    accentStyles.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.07]
        bg-white/[0.02]
        p-6
        text-left
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-0.5
        hover:border-white/[0.14]
        hover:bg-white/[0.035]
      "
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}
      >
        <Icon
          size={18}
          strokeWidth={1.5}
          className={style.icon}
        />
      </div>

      <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-white/30">
        {description}
      </p>

      <ArrowUpRight
        size={16}
        className="absolute bottom-6 right-6 text-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/50"
      />

      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-400 transition-all duration-700 group-hover:w-full" />
    </button>
  );
}

// ==========================================
// Request card
// ==========================================

function RequestCard({
  request,
  onAccept,
  onReject,
  onSchedule,
}) {
  const status =
    request.status ||
    "pending";

  const statusStyles = {
    pending:
      "border-amber-400/10 bg-amber-400/[0.04] text-amber-300",
    accepted:
      "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300",
    rejected:
      "border-red-400/10 bg-red-400/[0.04] text-red-300",
  };

  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] sm:p-6 lg:p-7">
      <div className="grid gap-7 lg:grid-cols-[1.5fr_0.55fr_0.55fr_auto] lg:items-center">
        {/* Employee */}

        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.05]">
              <span className="text-sm font-semibold text-blue-200">
                {request.name
                  ? request.name
                      .split(" ")
                      .map(
                        (part) =>
                          part[0]
                      )
                      .join("")
                      .slice(0, 2)
                  : "EM"}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold tracking-[-0.025em] text-white">
                {request.name ||
                  "Employee"}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <Mail
                  size={12}
                  className="shrink-0 text-white/20"
                />

                <p className="truncate text-xs text-white/35">
                  {request.email ||
                    "No email available"}
                </p>
              </div>

              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-white/20">
                Requested{" "}
                {request.createdAt
                  ? new Date(
                      request.createdAt
                    ).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
            Status
          </p>

          <span
            className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] ${
              statusStyles[status] ||
              statusStyles.pending
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {status}
          </span>
        </div>

        {/* Score */}

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
            AI Score
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
            {request.aiScore !==
                null &&
            request.aiScore !==
              undefined
              ? request.aiScore
              : "—"}

            {request.aiScore !==
                null &&
            request.aiScore !==
              undefined && (
              <span className="ml-1 text-[10px] text-white/20">
                /100
              </span>
            )}
          </p>
        </div>

        {/* Actions */}

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {status ===
            "pending" && (
            <>
              <button
                type="button"
                onClick={onAccept}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-emerald-400/[0.05]
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-emerald-300
                  transition-all
                  duration-300
                  hover:border-emerald-400/20
                  hover:bg-emerald-400/[0.09]
                "
              >
                <CheckCircle2
                  size={14}
                />

                Accept
              </button>

              <button
                type="button"
                onClick={onReject}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-400/10
                  bg-red-400/[0.04]
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-red-300
                  transition-all
                  duration-300
                  hover:border-red-400/20
                  hover:bg-red-400/[0.08]
                "
              >
                <XCircle
                  size={14}
                />

                Reject
              </button>
            </>
          )}

          {status ===
            "accepted" && (
            <button
              type="button"
              onClick={onSchedule}
              className="
                group/schedule
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-violet-400/15
                bg-violet-500/[0.08]
                px-4
                py-2.5
                text-xs
                font-semibold
                text-violet-200
                transition-all
                duration-300
                hover:border-violet-400/25
                hover:bg-violet-500/[0.13]
              "
            >
              <CalendarClock
                size={14}
              />

              Schedule

              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover/schedule:-translate-y-0.5 group-hover/schedule:translate-x-0.5"
              />
            </button>
          )}
        </div>
      </div>

      {/* Resume */}

      <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FileText
            size={14}
            className="text-white/20"
          />

          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
            Resume
          </span>
        </div>

        {request.resume?.url ? (
          <a
            href={
              request.resume.url
            }
            target="_blank"
            rel="noreferrer"
            className="
              group/resume
              inline-flex
              items-center
              gap-2
              text-xs
              font-medium
              text-blue-300/70
              transition-colors
              duration-300
              hover:text-blue-200
            "
          >
            View resume

            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover/resume:-translate-y-0.5 group-hover/resume:translate-x-0.5"
            />
          </a>
        ) : (
          <span className="text-xs text-white/20">
            No resume uploaded yet
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-400 transition-all duration-700 group-hover:w-full" />
    </article>
  );
}

// ==========================================
// Schedule modal
// ==========================================

function ScheduleModal({
  request,
  meetingTitle,
  setMeetingTitle,
  meetingDescription,
  setMeetingDescription,
  scheduledAt,
  setScheduledAt,
  durationMinutes,
  setDurationMinutes,
  scheduling,
  scheduleMessage,
  onClose,
  onSubmit,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="relative my-8 w-full max-w-xl overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#090c11] shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
        {/* Modal glow */}

        <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-[280px] w-[280px] rounded-full bg-violet-500/[0.08] blur-[100px]" />

        {/* Header */}

        <div className="relative border-b border-white/[0.07] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.05]">
                  <CalendarClock
                    size={16}
                    className="text-violet-300"
                  />
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-violet-300/60">
                  Schedule Interview
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                {request.name}
              </h2>

              <p className="mt-1 text-xs text-white/30">
                {request.email}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={scheduling}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                text-white/35
                transition-all
                duration-300
                hover:border-white/[0.14]
                hover:bg-white/[0.06]
                hover:text-white
                disabled:cursor-not-allowed
              "
              aria-label="Close schedule dialog"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Form */}

        <form
          onSubmit={onSubmit}
          className="relative space-y-5 p-6 sm:p-7"
        >
          <Field label="Meeting title">
            <input
              type="text"
              value={meetingTitle}
              onChange={(event) =>
                setMeetingTitle(
                  event.target.value
                )
              }
              required
              className="
                w-full
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition-all
                duration-300
                placeholder:text-white/20
                focus:border-violet-400/30
                focus:bg-white/[0.05]
              "
            />
          </Field>

          <Field label="Description">
            <textarea
              value={
                meetingDescription
              }
              onChange={(event) =>
                setMeetingDescription(
                  event.target.value
                )
              }
              rows="3"
              placeholder="Interview instructions..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-4
                py-3
                text-sm
                leading-6
                text-white
                outline-none
                transition-all
                duration-300
                placeholder:text-white/20
                focus:border-violet-400/30
                focus:bg-white/[0.05]
              "
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date & time">
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) =>
                  setScheduledAt(
                    event.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  duration-300
                  focus:border-violet-400/30
                  focus:bg-white/[0.05]
                "
              />
            </Field>

            <Field label="Duration">
              <select
                value={
                  durationMinutes
                }
                onChange={(event) =>
                  setDurationMinutes(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  duration-300
                  focus:border-violet-400/30
                  focus:bg-white/[0.05]
                "
              >
                <option value="15">
                  15 minutes
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="45">
                  45 minutes
                </option>

                <option value="60">
                  60 minutes
                </option>

                <option value="90">
                  90 minutes
                </option>
              </select>
            </Field>
          </div>

          {/* Message */}

          {scheduleMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-blue-400/10 bg-blue-400/[0.05] p-4 text-xs text-blue-200/80">
              <Sparkles
                size={15}
                className="mt-0.5 shrink-0 text-blue-300"
              />

              <span>
                {scheduleMessage}
              </span>
            </div>
          )}

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={scheduling}
              className="
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-5
                py-3
                text-sm
                font-medium
                text-white/50
                transition-all
                duration-300
                hover:border-white/[0.15]
                hover:bg-white/[0.05]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={scheduling}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-violet-300/15
                bg-violet-500
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[0_12px_35px_rgba(139,92,246,0.18)]
                transition-all
                duration-300
                hover:bg-violet-400
                hover:shadow-[0_16px_45px_rgba(139,92,246,0.25)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {scheduling ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />

                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarClock
                    size={15}
                  />

                  Schedule Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// Form field
// ==========================================

function Field({
  label,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      {children}
    </div>
  );
}