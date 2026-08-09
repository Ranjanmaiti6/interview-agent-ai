import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  XCircle,
  Video,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // Logged-in admin
  // ==========================================

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = getUser();

  // ==========================================
  // Requests
  // ==========================================

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Schedule modal
  // ==========================================

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [meetingTitle, setMeetingTitle] =
    useState("AI Interview");

  const [meetingDescription, setMeetingDescription] =
    useState("");

  const [scheduledAt, setScheduledAt] = useState("");

  const [durationMinutes, setDurationMinutes] =
    useState("30");

  const [scheduling, setScheduling] = useState(false);

  const [scheduleMessage, setScheduleMessage] =
    useState("");

  // ==========================================
  // Request action loading
  // ==========================================

  const [updatingRequestId, setUpdatingRequestId] =
    useState(null);

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // Load requests
  // ==========================================

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/employee/requests`,
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

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to load requests. HTTP ${response.status}`
        );
      }

      setRequests(
        Array.isArray(data.requests)
          ? data.requests
          : []
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
      setUpdatingRequestId(requestId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/employee/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

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
    } finally {
      setUpdatingRequestId(null);
    }
  };

  // ==========================================
  // START AI INTERVIEW
  // ==========================================

  const startInterview = (request) => {
    if (!request?.id) {
      setError("Candidate ID is missing.");
      return;
    }

    navigate(
      `/interview?id=${encodeURIComponent(
        request.id
      )}`,
      {
        state: {
          candidateId: request.id,
          employeeRequestId: request.id,
          employeeEmail: request.email,
          employeeName:
            request.name || "Candidate",
          meetingTitle:
            "AI Technical Interview",
        },
      }
    );
  };

  // ==========================================
  // Open schedule modal
  // ==========================================

  const openScheduleModal = (request) => {
    setSelectedRequest(request);

    setMeetingTitle("AI Interview");

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

  const scheduleMeeting = async (event) => {
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

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication expired. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/meetings`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
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
              Number(durationMinutes) || 30,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

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
      }, 1200);
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
  // Statistics
  // ==========================================

  const stats = useMemo(() => {
    const pending = requests.filter(
      (request) =>
        request.status === "pending" ||
        !request.status
    ).length;

    const accepted = requests.filter(
      (request) =>
        request.status === "accepted"
    ).length;

    const rejected = requests.filter(
      (request) =>
        request.status === "rejected"
    ).length;

    return {
      total: requests.length,
      pending,
      accepted,
      rejected,
    };
  }, [requests]);

  // ==========================================
  // Status
  // ==========================================

  const getStatusConfig = (status) => {
    if (status === "accepted") {
      return {
        label: "Accepted",
        classes:
          "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
        icon: CheckCircle2,
        dot: "bg-emerald-400",
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        classes:
          "border-red-400/15 bg-red-400/[0.06] text-red-300",
        icon: XCircle,
        dot: "bg-red-400",
      };
    }

    return {
      label: "Pending",
      classes:
        "border-amber-400/15 bg-amber-400/[0.06] text-amber-300",
      icon: Clock3,
      dot: "bg-amber-400",
    };
  };

  // ==========================================
  // Initials
  // ==========================================

  const getInitials = (name) => {
    return (
      name || "Employee"
    )
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-[#05070a] text-white">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.055] blur-[160px]" />

        <div className="absolute right-[-15%] top-[5%] h-[550px] w-[550px] rounded-full bg-cyan-500/[0.025] blur-[170px]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[600px] w-[600px] rounded-full bg-indigo-600/[0.025] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="relative z-30 border-b border-white/[0.06] bg-[#05070a]/75 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/[0.06]">

              <BrainCircuit
                size={21}
                strokeWidth={1.4}
                className="text-blue-300"
              />

              <div className="absolute inset-0 rounded-2xl bg-blue-400/[0.05] blur-xl" />

            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-blue-300/70">
                Admin Console
              </p>

              <h1 className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-white sm:text-base">
                Interview Intelligence
              </h1>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2 sm:flex">

              <span className="relative flex h-1.5 w-1.5">

                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />

              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-300/60">
                System online
              </span>

            </div>

            <button
              type="button"
              onClick={logout}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-semibold text-white/50 transition-all duration-300 hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-300"
            >
              <LogOut size={14} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-white/[0.018] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:p-10 lg:p-12">

          <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[420px] w-[420px] rounded-full bg-blue-500/[0.055] blur-[110px]" />

          <div className="pointer-events-none absolute bottom-[-150px] left-[35%] h-[350px] w-[350px] rounded-full bg-indigo-500/[0.025] blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/10 bg-blue-300/[0.05] px-3 py-1.5">

                <Sparkles
                  size={12}
                  className="text-blue-300"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-300/75">
                  Control center
                </span>

              </div>

              <h2 className="mt-7 max-w-5xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl lg:text-6xl">

                Welcome back,{" "}

                <span className="text-white/35">
                  {user.name || "Admin"}
                </span>

              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                Manage candidate requests,
                review resumes, approve
                interviews, and start
                AI-powered interview sessions
                from one centralized workspace.
              </p>

            </div>

            <div className="flex min-w-[240px] items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/[0.07] text-sm font-semibold text-blue-200">

                {getInitials(
                  user.name || "Admin"
                )}

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-white/80">
                  {user.name || "Admin"}
                </p>

                <p className="mt-1 truncate text-xs text-white/30">
                  {user.email || "Administrator"}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* METRICS */}
        {/* ================================================= */}

        <section className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">

          <MetricCard
            icon={Users}
            label="Total requests"
            value={stats.total}
            description="Employee submissions"
          />

          <MetricCard
            icon={Clock3}
            label="Pending review"
            value={stats.pending}
            description="Awaiting decision"
            highlight={stats.pending > 0}
          />

          <MetricCard
            icon={CheckCircle2}
            label="Accepted"
            value={stats.accepted}
            description="Ready for interview"
          />

          <MetricCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            description="Closed requests"
          />

        </section>

        {/* ================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================= */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <ActionCard
            icon={FileText}
            title="Candidate Requests"
            description="Review resumes and interview applications."
            value={`${stats.total} ${
              stats.total === 1
                ? "request"
                : "requests"
            }`}
            accent="blue"
            onClick={() =>
              document
                .getElementById("employee-requests")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          />

          <ActionCard
            icon={CalendarDays}
            title="Meeting Control"
            description="View and manage scheduled interview sessions."
            value="Open meetings"
            accent="violet"
            onClick={() => navigate("/meetings")}
          />

          <ActionCard
            icon={Sparkles}
            title="AI Reports"
            description="Review interview scores and candidate results."
            value="Open reports"
            accent="emerald"
            onClick={() => navigate("/report")}
          />

        </section>

        {/* ================================================= */}
        {/* REQUEST PIPELINE */}
        {/* ================================================= */}

        <section
          id="employee-requests"
          className="mt-16"
        >

          <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-blue-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  Candidate pipeline
                </span>

              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                Interview requests.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/30">
                Review employee applications,
                make decisions, and start or
                schedule interviews.
              </p>

            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/45 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              />

              Refresh

            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-5">

              <XCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-300"
              />

              <div>

                <p className="text-sm font-semibold text-red-300">
                  Something went wrong
                </p>

                <p className="mt-1 text-xs leading-5 text-red-300/55">
                  {error}
                </p>

              </div>

            </div>
          )}

          {/* Loading */}

          {loading && (
            <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-[26px] border border-white/[0.07] bg-white/[0.018]">

              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-400/[0.05]">

                  <Loader2
                    size={21}
                    className="animate-spin text-blue-300"
                  />

                </div>

                <p className="mt-5 text-sm text-white/35">
                  Loading candidate requests...
                </p>

              </div>

            </div>
          )}

          {/* Empty */}

          {!loading &&
            requests.length === 0 && (
              <div className="mt-6 rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-12 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">

                  <Users
                    size={25}
                    className="text-white/20"
                  />

                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  No candidate requests
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/25">
                  New employee interview
                  requests will appear here
                  automatically.
                </p>

              </div>
            )}

          {/* Requests */}

          {!loading &&
            requests.length > 0 && (
              <div className="mt-6 space-y-4">

                {requests.map((request) => {

                  const status =
                    getStatusConfig(
                      request.status
                    );

                  const StatusIcon =
                    status.icon;

                  const isUpdating =
                    updatingRequestId ===
                    request.id;

                  return (
                    <article
                      key={request.id}
                      className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.018] shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-white/[0.025]"
                    >

                      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-blue-500/[0.055] opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-100" />

                      <div className="relative p-6 sm:p-7">

                        {/* Candidate Header */}

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                          <div className="flex min-w-0 items-start gap-4">

                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-400/[0.06]">

                              <span className="text-xs font-semibold text-blue-200">
                                {getInitials(
                                  request.name
                                )}
                              </span>

                            </div>

                            <div className="min-w-0">

                              <h3 className="truncate text-lg font-semibold tracking-[-0.025em] text-white">
                                {request.name ||
                                  "Employee"}
                              </h3>

                              <p className="mt-1 truncate text-sm text-white/35">
                                {request.email ||
                                  "No email"}
                              </p>

                              <p className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/20">

                                <Clock3 size={11} />

                                Requested{" "}
                                {request.createdAt
                                  ? new Date(
                                      request.createdAt
                                    ).toLocaleString()
                                  : "Unknown"}

                              </p>

                            </div>

                          </div>

                          {/* Status */}

                          <div
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] ${status.classes}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            <StatusIcon size={12} />

                            {status.label}

                          </div>

                        </div>

                        {/* Details */}

                        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-3">

                          {/* Score */}

                          <div className="bg-black/20 p-5">

                            <div className="flex items-center justify-between">

                              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                                AI score
                              </p>

                              <Sparkles
                                size={13}
                                className="text-white/15"
                              />

                            </div>

                            <p className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-white">

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
                                <span className="ml-1 text-[10px] font-normal text-white/20">
                                  /100
                                </span>
                              )}

                            </p>

                          </div>

                          {/* Resume */}

                          <div className="bg-black/20 p-5">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                              Resume
                            </p>

                            {request.resume?.url ? (
                              <a
                                href={
                                  request.resume.url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition-colors hover:text-blue-200"
                              >

                                <FileText size={14} />

                                View Resume

                                <ArrowUpRight size={13} />

                              </a>
                            ) : (
                              <p className="mt-3 text-sm text-white/25">
                                Not uploaded
                              </p>
                            )}

                          </div>

                          {/* Workflow */}

                          <div className="bg-black/20 p-5">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                              Workflow
                            </p>

                            <p className="mt-3 text-sm font-medium text-white/55">

                              {request.status ===
                              "accepted"
                                ? "Ready for interview"
                                : request.status ===
                                  "rejected"
                                ? "Request closed"
                                : "Awaiting review"}

                            </p>

                          </div>

                        </div>

                        {/* ================================================= */}
                        {/* ACTIONS */}
                        {/* ================================================= */}

                        <div className="mt-6 flex flex-wrap gap-3">

                          {/* Pending */}

                          {request.status ===
                            "pending" && (
                            <>
                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    "accepted"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                              >

                                {isUpdating ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Check size={14} />
                                )}

                                Accept

                              </button>

                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    "rejected"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-2.5 text-xs font-semibold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/30 hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                              >

                                <X size={14} />

                                Reject

                              </button>
                            </>
                          )}

                          {/* ================================================= */}
                          {/* ACCEPTED CANDIDATE */}
                          {/* ================================================= */}

                          {request.status ===
                            "accepted" && (
                            <>
                              {/* START INTERVIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  startInterview(
                                    request
                                  )
                                }
                                className="group/button inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_10px_35px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_15px_45px_rgba(37,99,235,0.28)]"
                              >

                                <Video
                                  size={15}
                                />

                                Start AI Interview

                                <ArrowUpRight
                                  size={13}
                                  className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                                />

                              </button>

                              {/* SCHEDULE */}

                              <button
                                type="button"
                                onClick={() =>
                                  openScheduleModal(
                                    request
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-400/15 bg-blue-400/[0.04] px-4 py-2.5 text-xs font-semibold text-blue-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-400/[0.08]"
                              >

                                <CalendarDays
                                  size={14}
                                />

                                Schedule Interview

                              </button>
                            </>
                          )}

                        </div>

                      </div>

                      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-400 transition-all duration-700 group-hover:w-full" />

                    </article>
                  );
                })}

              </div>
            )}

        </section>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />

            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
              Interview management system operational
            </span>

          </div>

          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/15">

            <ShieldCheck size={12} />

            Secure admin session

          </div>

        </div>

      </main>

      {/* ================================================= */}
      {/* SCHEDULE MODAL */}
      {/* ================================================= */}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-xl sm:p-6">

          <button
            type="button"
            aria-label="Close"
            onClick={closeScheduleModal}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#080c12] shadow-[0_40px_160px_rgba(0,0,0,0.70)]">

            <div className="pointer-events-none absolute left-1/2 top-[-100px] h-[260px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/[0.09] blur-[100px]" />

            {/* Modal Header */}

            <div className="relative flex items-start justify-between border-b border-white/[0.07] p-6 sm:p-7">

              <div>

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={15}
                    className="text-blue-300"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-300/70">
                    Schedule interview
                  </p>

                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  {selectedRequest.name ||
                    "Employee"}
                </h2>

                <p className="mt-1 text-sm text-white/30">
                  {selectedRequest.email}
                </p>

              </div>

              <button
                type="button"
                onClick={closeScheduleModal}
                disabled={scheduling}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/35 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
              >

                <X size={17} />

              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={scheduleMeeting}
              className="relative space-y-5 p-6 sm:p-7"
            >

              {/* Title */}

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.20em] text-white/30">
                  Meeting title
                </label>

                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(event) =>
                    setMeetingTitle(
                      event.target.value
                    )
                  }
                  required
                  placeholder="AI Interview"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/30 focus:bg-white/[0.045] focus:ring-2 focus:ring-blue-400/[0.05]"
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.20em] text-white/30">
                  Interview notes
                </label>

                <textarea
                  rows={3}
                  value={meetingDescription}
                  onChange={(event) =>
                    setMeetingDescription(
                      event.target.value
                    )
                  }
                  placeholder="Interview instructions or notes..."
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/30 focus:bg-white/[0.045] focus:ring-2 focus:ring-blue-400/[0.05]"
                />

              </div>

              {/* Date / Duration */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.20em] text-white/30">
                    Date & time
                  </label>

                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) =>
                      setScheduledAt(
                        event.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-blue-400/30 focus:bg-white/[0.045]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.20em] text-white/30">
                    Duration
                  </label>

                  <select
                    value={durationMinutes}
                    onChange={(event) =>
                      setDurationMinutes(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0c1118] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-blue-400/30"
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

                </div>

              </div>

              {/* Message */}

              {scheduleMessage && (
                <div
                  className={`flex items-start gap-3 rounded-xl border p-4 ${
                    scheduleMessage.includes(
                      "successfully"
                    )
                      ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300"
                      : "border-red-400/15 bg-red-400/[0.05] text-red-300"
                  }`}
                >

                  {scheduleMessage.includes(
                    "successfully"
                  ) ? (
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                  )}

                  <p className="text-xs leading-5">
                    {scheduleMessage}
                  </p>

                </div>
              )}

              {/* Security */}

              <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-4">

                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-300/60"
                />

                <p className="text-[10px] leading-5 text-white/25">
                  This meeting will be linked
                  to the selected employee and
                  become available through the
                  authenticated meetings workflow.
                </p>

              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeScheduleModal}
                  disabled={scheduling}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white/45 transition-all duration-300 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={scheduling}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <CalendarDays size={15} />

                      Schedule Meeting
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

// ======================================================
// METRIC CARD
// ======================================================

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  highlight = false,
}) {
  return (
    <div className="group relative bg-[#080b10] p-6">

      <div className="flex items-start justify-between">

        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/20">
          {label}
        </span>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
            highlight
              ? "border-amber-300/10 bg-amber-400/[0.05]"
              : "border-white/[0.06] bg-white/[0.02]"
          }`}
        >

          <Icon
            size={15}
            strokeWidth={1.4}
            className={
              highlight
                ? "text-amber-300/70"
                : "text-white/15"
            }
          />

        </div>

      </div>

      <p
        className={`mt-8 text-4xl font-semibold tracking-[-0.055em] ${
          highlight
            ? "text-amber-200"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-white/25">
        {description}
      </p>

      <div
        className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full ${
          highlight
            ? "bg-amber-400"
            : "bg-blue-500"
        }`}
      />

    </div>
  );
}

// ======================================================
// ACTION CARD
// ======================================================

function ActionCard({
  icon: Icon,
  title,
  description,
  value,
  accent,
  onClick,
}) {
  const accentClasses = {
    blue: {
      icon:
        "border-blue-300/10 bg-blue-500/[0.06] text-blue-300",
      hover:
        "hover:border-blue-400/20",
      glow:
        "group-hover:bg-blue-500/[0.025]",
    },

    violet: {
      icon:
        "border-violet-300/10 bg-violet-500/[0.06] text-violet-300",
      hover:
        "hover:border-violet-400/20",
      glow:
        "group-hover:bg-violet-500/[0.025]",
    },

    emerald: {
      icon:
        "border-emerald-300/10 bg-emerald-500/[0.06] text-emerald-300",
      hover:
        "hover:border-emerald-400/20",
      glow:
        "group-hover:bg-emerald-500/[0.025]",
    },
  };

  const styles =
    accentClasses[accent] ||
    accentClasses.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.018] p-6 text-left backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.03] ${styles.hover}`}
    >

      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-[70px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${styles.glow}`}
      />

      <div className="relative flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${styles.icon}`}
        >
          <Icon
            size={19}
            strokeWidth={1.5}
          />
        </div>

        <ArrowUpRight
          size={17}
          className="text-white/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/55"
        />

      </div>

      <div className="relative">

        <h3 className="mt-7 text-base font-semibold text-white/85">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-6 text-white/30">
          {description}
        </p>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25 transition-colors duration-300 group-hover:text-blue-300/60">
          {value}
        </p>

      </div>

      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-400 transition-all duration-700 group-hover:w-full" />

    </button>
  );
}