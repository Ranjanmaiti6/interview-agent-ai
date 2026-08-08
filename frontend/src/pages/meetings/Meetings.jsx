import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  Sparkles,
  Users,
  Timer,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

export default function Meetings() {
  const navigate = useNavigate();

  // ==========================================
  // USER
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

  const isAdmin =
    user.role === "admin";

  const isEmployee =
    user.role === "employee";

  // ==========================================
  // STATE
  // ==========================================

  const [meetings, setMeetings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  // ==========================================
  // AUTH
  // ==========================================

  const getToken = () =>
    localStorage.getItem("token");

  // ==========================================
  // DATE HELPERS
  // ==========================================

  const getDateObject = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  const formatDate = (value) => {
    const date = getDateObject(value);

    if (!date) {
      return "No scheduled time";
    }

    return date.toLocaleDateString(
      undefined,
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatTime = (value) => {
    const date = getDateObject(value);

    if (!date) {
      return "--:--";
    }

    return date.toLocaleTimeString(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const formatFullDate = (value) => {
    const date = getDateObject(value);

    if (!date) {
      return "No scheduled time";
    }

    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==========================================
  // LOAD MEETINGS
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

        const token =
          getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const endpoint =
          isEmployee
            ? "/api/meetings/my"
            : "/api/meetings";

        const response =
          await fetch(
            `${API_URL}${endpoint}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
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

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to load meetings. HTTP ${response.status}`
          );
        }

        setMeetings(
          Array.isArray(
            data.meetings
          )
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
    [
      navigate,
      isEmployee,
    ]
  );

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  // ==========================================
  // DELETE MEETING
  // ==========================================

  const deleteMeeting = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this meeting?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const token =
        getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/meetings/${encodeURIComponent(
            id
          )}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",
            },
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

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete meeting."
        );
      }

      setMeetings(
        (previous) =>
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
  // STATUS
  // ==========================================

  const getStatusConfig = (
    status
  ) => {
    const normalized =
      String(
        status || "scheduled"
      ).toLowerCase();

    if (
      normalized ===
      "completed"
    ) {
      return {
        label: "Completed",
        classes:
          "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
        icon:
          CheckCircle2,
        dot:
          "bg-emerald-400",
      };
    }

    if (
      normalized ===
        "cancelled" ||
      normalized ===
        "canceled"
    ) {
      return {
        label: "Cancelled",
        classes:
          "border-red-400/15 bg-red-400/[0.06] text-red-300",
        icon:
          XCircle,
        dot:
          "bg-red-400",
      };
    }

    return {
      label: "Scheduled",
      classes:
        "border-blue-400/15 bg-blue-400/[0.06] text-blue-300",
      icon:
        CalendarDays,
      dot:
        "bg-blue-400",
    };
  };

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    const scheduled =
      meetings.filter(
        (meeting) => {
          const status =
            String(
              meeting.status ||
                "scheduled"
            ).toLowerCase();

          return (
            status ===
              "scheduled" ||
            status ===
              "pending"
          );
        }
      ).length;

    const completed =
      meetings.filter(
        (meeting) =>
          String(
            meeting.status || ""
          ).toLowerCase() ===
          "completed"
      ).length;

    const cancelled =
      meetings.filter(
        (meeting) => {
          const status =
            String(
              meeting.status || ""
            ).toLowerCase();

          return (
            status ===
              "cancelled" ||
            status ===
              "canceled"
          );
        }
      ).length;

    return {
      total:
        meetings.length,
      scheduled,
      completed,
      cancelled,
    };
  }, [meetings]);

  // ==========================================
  // UPCOMING MEETING
  // ==========================================

  const upcomingMeeting =
    useMemo(() => {
      const now =
        new Date();

      return (
        meetings
          .filter((meeting) => {
            const date =
              getDateObject(
                meeting.scheduled_at
              );

            const status =
              String(
                meeting.status ||
                  "scheduled"
              ).toLowerCase();

            return (
              date &&
              date >= now &&
              status !==
                "cancelled" &&
              status !==
                "canceled" &&
              status !==
                "completed"
            );
          })
          .sort(
            (a, b) =>
              new Date(
                a.scheduled_at
              ) -
              new Date(
                b.scheduled_at
              )
          )[0] || null
      );
    }, [meetings]);

  // ==========================================
  // DASHBOARD
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
  // RENDER
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040609] text-white">

      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-blue-500/[0.055] blur-[160px]" />

        <div className="absolute right-[-12%] top-[15%] h-[550px] w-[550px] rounded-full bg-violet-500/[0.035] blur-[160px]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[600px] w-[600px] rounded-full bg-cyan-500/[0.025] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize:
              "34px 34px",
          }}
        />

      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="relative z-30 border-b border-white/[0.06] bg-[#06080c]/75 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3.5">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/[0.07] shadow-[0_10px_40px_rgba(37,99,235,0.08)]">

              <Video
                size={20}
                strokeWidth={1.4}
                className="text-blue-300"
              />

              <div className="absolute inset-0 rounded-2xl bg-blue-400/[0.04] blur-xl" />

            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-blue-400/75">
                Interview Platform
              </p>

              <h1 className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-white sm:text-base">
                {isAdmin
                  ? "Meeting Control"
                  : "My Meetings"}
              </h1>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2 sm:flex">

              <span className="relative flex h-1.5 w-1.5">

                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />

              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-300/55">
                System online
              </span>

            </div>

            <button
              type="button"
              onClick={
                goToDashboard
              }
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-semibold text-white/50 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.055] hover:text-white"
            >

              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />

              <span className="hidden sm:inline">
                Dashboard
              </span>

            </button>

          </div>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

        {/* ====================================
            PAGE INTRO
        ==================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.018] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-9 lg:p-11">

          <div className="pointer-events-none absolute right-[-120px] top-[-150px] h-[420px] w-[420px] rounded-full bg-blue-500/[0.055] blur-[110px]" />

          <div className="pointer-events-none absolute bottom-[-160px] left-[35%] h-[300px] w-[300px] rounded-full bg-cyan-400/[0.025] blur-[100px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-blue-500" />

                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  {isAdmin
                    ? "Scheduling Control"
                    : "Interview Calendar"}
                </span>

              </div>

              <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">

                {isAdmin
                  ? "Manage every interview."
                  : "Your interview schedule."}

              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">

                {isAdmin
                  ? "Schedule, monitor, and manage employee interview sessions from one intelligent workspace."
                  : "View your upcoming sessions, meeting details, and interview access from one workspace."}

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
                className="group inline-flex w-fit items-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-400 hover:shadow-[0_18px_55px_rgba(37,99,235,0.28)]"
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

        </section>

        {/* ====================================
            STATS
        ==================================== */}

        <section className="mt-6 grid gap-px overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">

          <MeetingStat
            label="Total"
            value={
              stats.total
            }
            description="All meetings"
            icon={Video}
          />

          <MeetingStat
            label="Scheduled"
            value={
              stats.scheduled
            }
            description="Upcoming sessions"
            icon={
              CalendarDays
            }
          />

          <MeetingStat
            label="Completed"
            value={
              stats.completed
            }
            description="Finished sessions"
            icon={
              CheckCircle2
            }
          />

          <MeetingStat
            label="Cancelled"
            value={
              stats.cancelled
            }
            description="Closed sessions"
            icon={XCircle}
          />

        </section>

        {/* ====================================
            UPCOMING SPOTLIGHT
        ==================================== */}

        {!loading &&
          upcomingMeeting && (
            <section className="mt-6">

              <div className="relative overflow-hidden rounded-[28px] border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.08] via-white/[0.025] to-white/[0.012] p-6 shadow-[0_30px_100px_rgba(37,99,235,0.08)] sm:p-8">

                <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[330px] w-[330px] rounded-full bg-blue-500/[0.10] blur-[100px]" />

                <div className="relative">

                  <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <Sparkles
                          size={14}
                          className="text-blue-300"
                        />

                        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-blue-300/70">
                          Next interview
                        </p>

                      </div>

                      <h3 className="mt-4 truncate text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                        {upcomingMeeting.title ||
                          "Interview Meeting"}
                      </h3>

                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">

                        <span className="inline-flex items-center gap-2 text-xs text-white/45">

                          <CalendarDays
                            size={14}
                            className="text-blue-300/70"
                          />

                          {formatDate(
                            upcomingMeeting.scheduled_at
                          )}

                        </span>

                        <span className="inline-flex items-center gap-2 text-xs text-white/45">

                          <Clock3
                            size={14}
                            className="text-blue-300/70"
                          />

                          {formatTime(
                            upcomingMeeting.scheduled_at
                          )}

                        </span>

                        <span className="inline-flex items-center gap-2 text-xs text-white/45">

                          <Timer
                            size={14}
                            className="text-blue-300/70"
                          />

                          {upcomingMeeting.duration_minutes ||
                            30}{" "}
                          min

                        </span>

                      </div>

                      {isAdmin &&
                        upcomingMeeting.employee_name && (
                          <div className="mt-5 flex items-center gap-2 text-xs text-white/30">

                            <Users
                              size={13}
                            />

                            <span>
                              {upcomingMeeting.employee_name}
                            </span>

                            {upcomingMeeting.employee_email && (
                              <>
                                <span className="text-white/10">
                                  •
                                </span>

                                <span>
                                  {upcomingMeeting.employee_email}
                                </span>
                              </>
                            )}

                          </div>
                        )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/meetings/${encodeURIComponent(
                            upcomingMeeting.id
                          )}`
                        )
                      }
                      className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.20)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-400 hover:shadow-[0_18px_50px_rgba(37,99,235,0.30)]"
                    >

                      <Video
                        size={16}
                      />

                      Open Interview

                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />

                    </button>

                  </div>

                </div>

              </div>

            </section>
          )}

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-5">

            <XCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-300"
            />

            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-red-300">
                Meeting error
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300/55">
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
              <XCircle
                size={16}
              />
            </button>

          </div>
        )}

        {/* ====================================
            PIPELINE
        ==================================== */}

        <section className="mt-14">

          <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/20">
                {isAdmin
                  ? "All sessions"
                  : "Your sessions"}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
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
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-white/40 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* ==================================
              LOADING
          ================================== */}

          {loading && (
            <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-[26px] border border-white/[0.07] bg-white/[0.018]">

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-400/[0.05]">

                  <Loader2
                    size={23}
                    className="animate-spin text-blue-300"
                  />

                </div>

                <p className="mt-5 text-sm font-medium text-white/45">
                  Loading meetings
                </p>

                <p className="mt-1 text-xs text-white/20">
                  Synchronizing your interview schedule...
                </p>

              </div>

            </div>
          )}

          {/* ==================================
              EMPTY
          ================================== */}

          {!loading &&
            meetings.length ===
              0 && (
              <div className="mt-6 overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-10 text-center sm:p-14">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/[0.07] bg-white/[0.025] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

                  <CalendarDays
                    size={30}
                    strokeWidth={1.3}
                    className="text-white/25"
                  />

                </div>

                <h3 className="mt-7 text-xl font-semibold text-white">
                  No meetings yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                  {isAdmin
                    ? "Create a meeting to schedule an employee interview."
                    : "You do not have any scheduled interviews yet."}
                </p>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/meetings/create"
                      )
                    }
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >

                    <Plus
                      size={16}
                    />

                    Create Meeting

                  </button>
                )}

              </div>
            )}

          {/* ==================================
              MEETINGS
          ================================== */}

          {!loading &&
            meetings.length >
              0 && (
              <div className="mt-6 space-y-4">

                {meetings.map(
                  (
                    meeting,
                    index
                  ) => {

                    const status =
                      getStatusConfig(
                        meeting.status
                      );

                    const StatusIcon =
                      status.icon;

                    const date =
                      getDateObject(
                        meeting.scheduled_at
                      );

                    const isUpcoming =
                      upcomingMeeting?.id ===
                      meeting.id;

                    return (
                      <article
                        key={
                          meeting.id ||
                          index
                        }
                        className={`group relative overflow-hidden rounded-[26px] border bg-white/[0.018] transition-all duration-500 ${
                          isUpcoming
                            ? "border-blue-400/15 shadow-[0_20px_80px_rgba(37,99,235,0.06)]"
                            : "border-white/[0.07] hover:border-white/[0.13] hover:bg-white/[0.025]"
                        }`}
                      >

                        {/* Glow */}

                        <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-blue-500/[0.045] opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-100" />

                        {isUpcoming && (
                          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-blue-400 via-blue-500/40 to-transparent" />
                        )}

                        <div className="relative p-5 sm:p-7">

                          <div className="flex flex-col gap-6 xl:flex-row xl:items-center">

                            {/* DATE TILE */}

                            <div className="flex shrink-0 items-center gap-4 xl:block xl:w-[90px]">

                              <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-black/20">

                                {date ? (
                                  <>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-300/65">
                                      {date.toLocaleDateString(
                                        undefined,
                                        {
                                          month:
                                            "short",
                                        }
                                      )}
                                    </span>

                                    <span className="mt-0.5 text-2xl font-semibold tracking-[-0.06em] text-white">
                                      {date.getDate()}
                                    </span>
                                  </>
                                ) : (
                                  <CalendarDays
                                    size={
                                      22
                                    }
                                    className="text-white/25"
                                  />
                                )}

                              </div>

                              <div className="xl:mt-3">

                                <p className="text-xs font-medium text-white/45">
                                  {date
                                    ? formatTime(
                                        meeting.scheduled_at
                                      )
                                    : "--:--"}
                                </p>

                                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/20">
                                  {date
                                    ? "Local time"
                                    : "Unscheduled"}
                                </p>

                              </div>

                            </div>

                            {/* MAIN CONTENT */}

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-wrap items-center gap-2.5">

                                <h3 className="max-w-full truncate text-xl font-semibold tracking-[-0.035em] text-white">
                                  {meeting.title ||
                                    "Interview Meeting"}
                                </h3>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] ${status.classes}`}
                                >

                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                  />

                                  <StatusIcon
                                    size={
                                      10
                                    }
                                  />

                                  {
                                    status.label
                                  }

                                </span>

                                {isUpcoming && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/15 bg-blue-400/[0.05] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">

                                    <Sparkles
                                      size={
                                        10
                                      }
                                    />

                                    Next

                                  </span>
                                )}

                              </div>

                              {/* ADMIN INFO */}

                              {isAdmin && (
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">

                                  <span className="text-sm font-medium text-white/55">
                                    {meeting.employee_name ||
                                      "Employee"}
                                  </span>

                                  {meeting.employee_email && (
                                    <>
                                      <span className="text-white/10">
                                        •
                                      </span>

                                      <span className="text-xs text-white/25">
                                        {
                                          meeting.employee_email
                                        }
                                      </span>
                                    </>
                                  )}

                                </div>
                              )}

                              {/* META */}

                              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">

                                <span className="inline-flex items-center gap-2 text-xs text-white/30">

                                  <CalendarDays
                                    size={
                                      13
                                    }
                                    className="text-white/20"
                                  />

                                  {formatDate(
                                    meeting.scheduled_at
                                  )}

                                </span>

                                <span className="inline-flex items-center gap-2 text-xs text-white/30">

                                  <Clock3
                                    size={
                                      13
                                    }
                                    className="text-white/20"
                                  />

                                  {meeting.duration_minutes ||
                                    30}{" "}
                                  minutes

                                </span>

                              </div>

                              {meeting.description && (
                                <p className="mt-4 max-w-2xl text-xs leading-6 text-white/25">
                                  {
                                    meeting.description
                                  }
                                </p>
                              )}

                            </div>

                            {/* ACTIONS */}

                            <div className="flex shrink-0 flex-wrap gap-2.5">

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/meetings/${encodeURIComponent(
                                      meeting.id
                                    )}`
                                  )
                                }
                                className="group/button inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_28px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_12px_35px_rgba(37,99,235,0.22)]"
                              >

                                <Video
                                  size={
                                    14
                                  }
                                />

                                <span>
                                  {meeting.meeting_url
                                    ? "Join"
                                    : "Open"}
                                </span>

                                <ArrowUpRight
                                  size={
                                    13
                                  }
                                  className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                                />

                              </button>

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
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.035] px-4 py-2.5 text-xs font-semibold text-red-300 transition-all duration-300 hover:border-red-400/25 hover:bg-red-400/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                  {deletingId ===
                                  meeting.id ? (
                                    <Loader2
                                      size={
                                        14
                                      }
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={
                                        14
                                      }
                                    />
                                  )}

                                  <span className="hidden sm:inline">
                                    {deletingId ===
                                    meeting.id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </span>

                                </button>
                              )}

                            </div>

                          </div>

                        </div>

                        {/* Bottom accent */}

                        <div
                          className={`absolute bottom-0 left-0 h-px bg-blue-500 transition-all duration-700 ${
                            isUpcoming
                              ? "w-full opacity-50"
                              : "w-0 group-hover:w-full"
                          }`}
                        />

                      </article>
                    );
                  }
                )}

              </div>
            )}

        </section>

        {/* ====================================
            SECURITY / SYSTEM
        ==================================== */}

        <section className="mt-10 rounded-[22px] border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">

              <ShieldCheck
                size={18}
                className="text-emerald-300/70"
              />

            </div>

            <div className="min-w-0">

              <p className="text-xs font-semibold text-white/60">
                Secure meeting workflow
              </p>

              <p className="mt-1 text-[10px] leading-5 text-white/25">
                Meeting access and management
                actions are protected by your
                authenticated session.
              </p>

            </div>

            <div className="sm:ml-auto">

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.03] px-3 py-2">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-emerald-300/50">
                  Protected
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

// ==========================================
// MEETING STAT
// ==========================================

function MeetingStat({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group relative bg-[#080b10]/95 p-6 transition-colors duration-500 hover:bg-[#0b0f15]">

      <div className="flex items-start justify-between">

        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/20">
          {label}
        </span>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02]">

          <Icon
            size={15}
            strokeWidth={1.4}
            className="text-white/20 transition-colors duration-500 group-hover:text-blue-300/70"
          />

        </div>

      </div>

      <p className="mt-7 text-4xl font-semibold tracking-[-0.06em] text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-white/25">
        {description}
      </p>

      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />

    </div>
  );
}