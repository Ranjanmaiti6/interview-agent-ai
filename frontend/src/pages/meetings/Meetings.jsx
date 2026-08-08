import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Video,
  XCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Meetings() {
  const navigate = useNavigate();

  // ==========================================
  // User
  // ==========================================

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  };

  const user = getUser();

  const isAdmin = user.role === "admin";
  const isEmployee = user.role === "employee";

  // ==========================================
  // State
  // ==========================================

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // Helpers
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const formatDate = (value) => {
    if (!value) {
      return "No scheduled time";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // Load meetings
  // ==========================================

  const loadMeetings = useCallback(
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

        const endpoint = isEmployee
          ? "/api/meetings/my"
          : "/api/meetings";

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
              `Unable to load meetings. HTTP ${response.status}`
          );
        }

        setMeetings(
          Array.isArray(data.meetings)
            ? data.meetings
            : []
        );
      } catch (error) {
        console.error(
          "Load meetings error:",
          error
        );

        setError(
          error.message ||
            "Unable to load meetings."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate, isEmployee]
  );

  // ==========================================
  // Initial load
  // ==========================================

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  // ==========================================
  // Delete meeting
  // ==========================================

  const deleteMeeting = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/meetings/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",

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
            "Unable to delete meeting."
        );
      }

      setMeetings((previous) =>
        previous.filter(
          (meeting) =>
            meeting.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete meeting error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete meeting."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // Status configuration
  // ==========================================

  const getStatusConfig = (status) => {
    const normalized =
      String(status || "scheduled")
        .toLowerCase();

    if (normalized === "completed") {
      return {
        label: "Completed",
        classes:
          "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300",
        icon: CheckCircle2,
      };
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return {
        label: "Cancelled",
        classes:
          "border-red-400/15 bg-red-400/[0.05] text-red-300",
        icon: XCircle,
      };
    }

    return {
      label: "Scheduled",
      classes:
        "border-blue-400/15 bg-blue-400/[0.05] text-blue-300",
      icon: CalendarDays,
    };
  };

  // ==========================================
  // Statistics
  // ==========================================

  const stats = useMemo(() => {
    const scheduled = meetings.filter(
      (meeting) => {
        const status =
          String(
            meeting.status ||
              "scheduled"
          ).toLowerCase();

        return (
          status === "scheduled" ||
          status === "pending"
        );
      }
    ).length;

    const completed = meetings.filter(
      (meeting) =>
        String(
          meeting.status || ""
        ).toLowerCase() ===
        "completed"
    ).length;

    const cancelled = meetings.filter(
      (meeting) => {
        const status =
          String(
            meeting.status || ""
          ).toLowerCase();

        return (
          status === "cancelled" ||
          status === "canceled"
        );
      }
    ).length;

    return {
      total: meetings.length,
      scheduled,
      completed,
      cancelled,
    };
  }, [meetings]);

  // ==========================================
  // Dashboard navigation
  // ==========================================

  const goToDashboard = () => {
    if (isAdmin) {
      navigate("/admin");
      return;
    }

    if (isEmployee) {
      navigate("/employee");
      return;
    }

    navigate("/");
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* ====================================== */}
      {/* Ambient background */}
      {/* ====================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[8%] top-[-15%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.04] blur-[150px]" />

        <div className="absolute right-[-10%] top-[25%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.025] blur-[150px]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[480px] w-[480px] rounded-full bg-cyan-500/[0.02] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.06]">
              <Video
                size={20}
                strokeWidth={1.5}
                className="text-blue-300"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-400">
                Meetings
              </p>

              <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.02em]">
                {isAdmin
                  ? "Meeting Control"
                  : "My Meetings"}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={goToDashboard}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/50 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />

            Dashboard
          </button>
        </div>
      </header>

      {/* ====================================== */}
      {/* Main */}
      {/* ====================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* ==================================== */}
        {/* Heading */}
        {/* ==================================== */}

        <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                {isAdmin
                  ? "Scheduling"
                  : "Interview Calendar"}
              </span>
            </div>

            <h2 className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">
              {isAdmin
                ? "Manage meetings."
                : "Your interview schedule."}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/35">
              {isAdmin
                ? "Schedule, monitor, and manage employee interview sessions."
                : "View your upcoming interview sessions and join when they are ready."}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/meetings/create"
                )
              }
              className="group inline-flex w-fit items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(37,99,235,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_14px_42px_rgba(37,99,235,0.24)]"
            >
              <Plus size={17} />

              Create Meeting

              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          )}
        </div>

        {/* ==================================== */}
        {/* Stats */}
        {/* ==================================== */}

        <div className="mt-8 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          <MeetingStat
            label="Total"
            value={stats.total}
            description="All meetings"
            icon={Video}
          />

          <MeetingStat
            label="Scheduled"
            value={stats.scheduled}
            description="Upcoming sessions"
            icon={CalendarDays}
          />

          <MeetingStat
            label="Completed"
            value={stats.completed}
            description="Finished sessions"
            icon={CheckCircle2}
          />

          <MeetingStat
            label="Cancelled"
            value={stats.cancelled}
            description="Closed sessions"
            icon={XCircle}
          />
        </div>

        {/* ==================================== */}
        {/* Error */}
        {/* ==================================== */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-5 text-sm text-red-300">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                Meeting error
              </p>

              <p className="mt-1 text-red-300/60">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-red-300/40 transition hover:text-red-300"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        {/* ==================================== */}
        {/* Meeting pipeline */}
        {/* ==================================== */}

        <section className="mt-14">
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/20">
                {isAdmin
                  ? "All sessions"
                  : "Scheduled sessions"}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Meeting pipeline
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                loadMeetings({
                  silent: true,
                })
              }
              disabled={
                loading ||
                refreshing
              }
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-white/40 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* ================================== */}
          {/* Loading */}
          {/* ================================== */}

          {loading && (
            <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-[24px] border border-white/[0.07] bg-white/[0.018]">
              <div className="text-center">
                <Loader2
                  size={25}
                  className="mx-auto animate-spin text-blue-300"
                />

                <p className="mt-4 text-sm text-white/30">
                  Loading meetings...
                </p>
              </div>
            </div>
          )}

          {/* ================================== */}
          {/* Empty */}
          {/* ================================== */}

          {!loading &&
            meetings.length === 0 && (
              <div className="mt-6 rounded-[24px] border border-white/[0.07] bg-white/[0.018] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  <CalendarDays
                    size={26}
                    className="text-white/25"
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  No meetings yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                  {isAdmin
                    ? "Create a meeting to schedule an employee interview."
                    : "You do not have any scheduled meetings yet."}
                </p>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/meetings/create"
                      )
                    }
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    <Plus size={16} />

                    Create Meeting
                  </button>
                )}
              </div>
            )}

          {/* ================================== */}
          {/* Meetings */}
          {/* ================================== */}

          {!loading &&
            meetings.length > 0 && (
              <div className="mt-6 space-y-4">
                {meetings.map(
                  (meeting) => {
                    const status =
                      getStatusConfig(
                        meeting.status
                      );

                    const StatusIcon =
                      status.icon;

                    return (
                      <article
                        key={
                          meeting.id
                        }
                        className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.018] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.025]"
                      >
                        {/* Hover glow */}

                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.045] opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />

                        <div className="relative p-6 sm:p-7">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                            {/* Meeting icon */}

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-500/[0.06]">
                              <Video
                                size={23}
                                strokeWidth={1.4}
                                className="text-blue-300"
                              />
                            </div>

                            {/* Information */}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-semibold tracking-[-0.025em] text-white">
                                  {meeting.title ||
                                    "Interview Meeting"}
                                </h3>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] ${status.classes}`}
                                >
                                  <StatusIcon
                                    size={11}
                                  />

                                  {status.label}
                                </span>
                              </div>

                              {/* Admin employee details */}

                              {isAdmin && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-white/55">
                                    {meeting.employee_name ||
                                      "Employee"}
                                  </p>

                                  {meeting.employee_email && (
                                    <p className="mt-0.5 text-xs text-white/25">
                                      {
                                        meeting.employee_email
                                      }
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Date / duration */}

                              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/30">
                                <span className="inline-flex items-center gap-2">
                                  <CalendarDays
                                    size={13}
                                  />

                                  {formatDate(
                                    meeting.scheduled_at
                                  )}
                                </span>

                                <span className="inline-flex items-center gap-2">
                                  <Clock3
                                    size={13}
                                  />

                                  {meeting.duration_minutes ||
                                    30}{" "}
                                  minutes
                                </span>
                              </div>

                              {/* Description */}

                              {meeting.description && (
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/25">
                                  {
                                    meeting.description
                                  }
                                </p>
                              )}
                            </div>

                            {/* Actions */}

                            <div className="flex shrink-0 flex-wrap gap-3 lg:justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/meetings/${encodeURIComponent(
                                      meeting.id
                                    )}`
                                  )
                                }
                                className="group/button inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
                              >
                                <Video
                                  size={14}
                                />

                                {meeting.meeting_url
                                  ? "Join Meeting"
                                  : "Open Meeting"}

                                <ArrowUpRight
                                  size={13}
                                  className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                                />
                              </button>

                              {/* Admin delete */}

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteMeeting(
                                      meeting.id
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    meeting.id
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-2.5 text-xs font-semibold text-red-300 transition-all duration-300 hover:border-red-400/25 hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deletingId ===
                                  meeting.id ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={14}
                                    />
                                  )}

                                  {deletingId ===
                                  meeting.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom hover accent */}

                        <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
                      </article>
                    );
                  }
                )}
              </div>
            )}
        </section>

        {/* ==================================== */}
        {/* Security note */}
        {/* ==================================== */}

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
            <ShieldCheck
              size={17}
              className="text-emerald-300/70"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-white/60">
              Meeting workflow operational
            </p>

            <p className="mt-1 text-[10px] leading-5 text-white/25">
              Meeting access and actions are protected by the authenticated
              session.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Meeting Stat
// ==========================================

function MeetingStat({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group relative bg-[#080b10]/90 p-6 transition-colors duration-500 hover:bg-[#0b0f15]">
      <div className="flex items-start justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/20">
          {label}
        </span>

        <Icon
          size={17}
          strokeWidth={1.4}
          className="text-white/15 transition-colors duration-500 group-hover:text-blue-300/60"
        />
      </div>

      <p className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-white/25">
        {description}
      </p>

      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}