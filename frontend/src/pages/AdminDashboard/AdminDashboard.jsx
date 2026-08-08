import { useEffect, useState } from "react";
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
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
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

  // ==========================================
  // Schedule meeting modal
  // ==========================================

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

      const response = await fetch(
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
              Number(durationMinutes) ||
              30,
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
  // Request counts
  // ==========================================

  const pendingCount =
    requests.filter(
      (request) =>
        request.status === "pending" ||
        !request.status
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

  // ==========================================
  // Status helper
  // ==========================================

  const getStatusConfig = (status) => {
    if (status === "accepted") {
      return {
        label: "Accepted",
        classes:
          "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300",
        dot: "bg-emerald-400",
        icon: CheckCircle2,
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        classes:
          "border-red-400/15 bg-red-400/[0.05] text-red-300",
        dot: "bg-red-400",
        icon: XCircle,
      };
    }

    return {
      label: "Pending",
      classes:
        "border-amber-400/15 bg-amber-400/[0.05] text-amber-300",
      dot: "bg-amber-400",
      icon: Clock3,
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* ========================================= */}
      {/* Ambient background */}
      {/* ========================================= */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[10%] top-[-15%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[150px]" />

        <div className="absolute right-[-10%] top-[15%] h-[480px] w-[480px] rounded-full bg-cyan-500/[0.025] blur-[150px]" />

        <div className="absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.025] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      {/* Top ambient line */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* ========================================= */}
      {/* Header */}
      {/* ========================================= */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.07]">
              <BrainCircuit
                size={21}
                strokeWidth={1.5}
                className="text-blue-300"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-400">
                Admin
              </p>

              <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.02em]">
                Interview Intelligence
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/55 transition-all duration-300 hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-300"
          >
            Logout

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </header>

      {/* ========================================= */}
      {/* Main */}
      {/* ========================================= */}

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* ======================================= */}
        {/* Page heading */}
        {/* ======================================= */}

        <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                Control Center
              </span>
            </div>

            <h2 className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">
              Welcome,{" "}
              <span className="text-white/45">
                {user.name || "Admin"}.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/40">
              Manage employee interview requests, candidate readiness,
              meetings, and AI evaluation workflows from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-4 py-2.5 lg:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
              System operational
            </span>
          </div>
        </div>

        {/* ======================================= */}
        {/* Overview metrics */}
        {/* ======================================= */}

        <div className="mt-8 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Total requests"
            value={requests.length}
            description="Employee submissions"
          />

          <MetricCard
            icon={Clock3}
            label="Pending review"
            value={pendingCount}
            description="Awaiting decision"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Accepted"
            value={acceptedCount}
            description="Ready for scheduling"
          />

          <MetricCard
            icon={XCircle}
            label="Rejected"
            value={rejectedCount}
            description="Closed requests"
          />
        </div>

        {/* ======================================= */}
        {/* Quick actions */}
        {/* ======================================= */}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ActionCard
            icon={FileText}
            title="Interview Requests"
            description="Review employee profiles and resumes."
            value={`${requests.length} request${
              requests.length === 1
                ? ""
                : "s"
            }`}
            accent="blue"
            onClick={() =>
              document
                .getElementById(
                  "employee-requests"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          />

          <ActionCard
            icon={CalendarDays}
            title="Meetings"
            description="Schedule and manage interviews."
            value="Open meetings"
            accent="violet"
            onClick={() =>
              navigate("/meetings")
            }
          />

          <ActionCard
            icon={Sparkles}
            title="AI Reports"
            description="Review interview scores and results."
            value="Open reports"
            accent="emerald"
            onClick={() =>
              navigate("/report")
            }
          />
        </div>

        {/* ======================================= */}
        {/* Employee Requests */}
        {/* ======================================= */}

        <section
          id="employee-requests"
          className="mt-16"
        >
          <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-blue-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  Employee Requests
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Interview pipeline.
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/30">
                Review, approve, reject, and schedule candidate interviews.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/50 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-300 group-hover:rotate-180"
                }
              />

              Refresh
            </button>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-5 text-sm text-red-300">
              <XCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Request error
                </p>

                <p className="mt-1 text-red-300/60">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}

          {loading && (
            <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-[24px] border border-white/[0.07] bg-white/[0.018]">
              <div className="text-center">
                <Loader2
                  size={25}
                  className="mx-auto animate-spin text-blue-300"
                />

                <p className="mt-4 text-sm text-white/35">
                  Loading employee requests...
                </p>
              </div>
            </div>
          )}

          {/* Empty */}

          {!loading &&
            requests.length === 0 && (
              <div className="mt-6 rounded-[24px] border border-white/[0.07] bg-white/[0.018] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  <Users
                    size={26}
                    className="text-white/25"
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  No employee requests
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                  New employee interview requests will appear here when they
                  are submitted.
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

                  return (
                    <article
                      key={request.id}
                      className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.018] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.025]"
                    >
                      {/* Hover glow */}

                      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.055] opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />

                      <div className="relative p-6 sm:p-7">
                        {/* Top row */}

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          {/* Employee */}

                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-500/[0.06]">
                              <span className="text-sm font-semibold text-blue-200">
                                {(request.name ||
                                  "Employee")
                                  .split(" ")
                                  .map(
                                    (part) =>
                                      part[0]
                                  )
                                  .join("")
                                  .slice(
                                    0,
                                    2
                                  )
                                  .toUpperCase()}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold tracking-[-0.02em] text-white">
                                {request.name ||
                                  "Employee"}
                              </h3>

                              <p className="mt-1 truncate text-sm text-white/35">
                                {request.email}
                              </p>

                              <p className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/20">
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
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${status.classes}`}
                          >
                            <StatusIcon
                              size={12}
                            />

                            {status.label}
                          </div>
                        </div>

                        {/* Information grid */}

                        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-3">
                          <div className="bg-black/20 p-4">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                              AI score
                            </p>

                            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                              {request.aiScore !==
                                null &&
                              request.aiScore !==
                                undefined
                                ? request.aiScore
                                : "—"}

                              {request.aiScore !==
                                null &&
                              request.aiScore !==
                                undefined ? (
                                <span className="ml-1 text-[10px] text-white/20">
                                  /100
                                </span>
                              ) : null}
                            </p>
                          </div>

                          <div className="bg-black/20 p-4">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                              Resume
                            </p>

                            {request.resume?.url ? (
                              <a
                                href={
                                  request
                                    .resume
                                    .url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition-colors hover:text-blue-200"
                              >
                                <FileText
                                  size={14}
                                />
                                View Resume
                              </a>
                            ) : (
                              <p className="mt-2 text-sm text-white/25">
                                Not uploaded
                              </p>
                            )}
                          </div>

                          <div className="bg-black/20 p-4">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                              Workflow
                            </p>

                            <p className="mt-2 text-sm font-medium text-white/55">
                              {request.status ===
                              "accepted"
                                ? "Ready to schedule"
                                : request.status ===
                                  "rejected"
                                ? "Request closed"
                                : "Awaiting review"}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}

                        <div className="mt-6 flex flex-wrap gap-3">
                          {request.status ===
                            "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    "accepted"
                                  )
                                }
                                className="group/button inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
                              >
                                <Check
                                  size={14}
                                />

                                Accept
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    "rejected"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-2.5 text-xs font-semibold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/30 hover:bg-red-400/[0.08]"
                              >
                                <X
                                  size={14}
                                />

                                Reject
                              </button>
                            </>
                          )}

                          {request.status ===
                            "accepted" && (
                            <button
                              type="button"
                              onClick={() =>
                                openScheduleModal(
                                  request
                                )
                              }
                              className="group/button inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_12px_38px_rgba(37,99,235,0.25)]"
                            >
                              <CalendarDays
                                size={14}
                              />

                              Schedule Meeting

                              <ArrowUpRight
                                size={14}
                                className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bottom accent */}

                      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
                    </article>
                  );
                })}
              </div>
            )}
        </section>
      </main>

      {/* ========================================= */}
      {/* Schedule Meeting Modal */}
      {/* ========================================= */}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6">
          <div
            className="fixed inset-0"
            onClick={closeScheduleModal}
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#080c12] shadow-[0_40px_140px_rgba(0,0,0,0.6)]">
            {/* Modal glow */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[90px]" />

            {/* Header */}

            <div className="relative flex items-start justify-between border-b border-white/[0.07] p-6 sm:p-7">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                    className="text-blue-300"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                    Schedule Interview
                  </p>
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-white">
                  {selectedRequest.name}
                </h2>

                <p className="mt-1 text-sm text-white/30">
                  {selectedRequest.email}
                </p>
              </div>

              <button
                type="button"
                onClick={closeScheduleModal}
                disabled={scheduling}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/35 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Close modal"
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
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
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
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/30 focus:bg-white/[0.04]"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Description
                </label>

                <textarea
                  value={
                    meetingDescription
                  }
                  onChange={(event) =>
                    setMeetingDescription(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Interview instructions..."
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/30 focus:bg-white/[0.04]"
                />
              </div>

              {/* Date and duration */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
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
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-blue-400/30 focus:bg-white/[0.04]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                    Duration
                  </label>

                  <select
                    value={
                      durationMinutes
                    }
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
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    scheduleMessage.includes(
                      "successfully"
                    )
                      ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300"
                      : "border-blue-400/15 bg-blue-400/[0.05] text-blue-300"
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
                    <Sparkles
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                  )}

                  <span>
                    {scheduleMessage}
                  </span>
                </div>
              )}

              {/* Security note */}

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.018] px-4 py-3">
                <ShieldCheck
                  size={15}
                  className="text-blue-300/60"
                />

                <p className="text-[10px] leading-5 text-white/25">
                  The meeting will be created for the selected employee and
                  available through the meetings workflow.
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeScheduleModal
                  }
                  disabled={scheduling}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white/50 transition-all duration-300 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={scheduling}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <CalendarDays
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
      )}
    </div>
  );
}

// ==========================================
// Metric card
// ==========================================

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
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

// ==========================================
// Action card
// ==========================================

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
      icon: "border-blue-300/10 bg-blue-500/[0.06] text-blue-300",
      hover:
        "group-hover:border-blue-400/20",
    },

    violet: {
      icon: "border-violet-300/10 bg-violet-500/[0.06] text-violet-300",
      hover:
        "group-hover:border-violet-400/20",
    },

    emerald: {
      icon: "border-emerald-300/10 bg-emerald-500/[0.06] text-emerald-300",
      hover:
        "group-hover:border-emerald-400/20",
    },
  };

  const colors =
    accentClasses[accent] ||
    accentClasses.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.03] ${colors.hover}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors.icon}`}
        >
          <Icon
            size={19}
            strokeWidth={1.5}
          />
        </div>

        <ArrowUpRight
          size={17}
          className="text-white/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/50"
        />
      </div>

      <h3 className="mt-7 text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/30">
        {description}
      </p>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25 transition-colors group-hover:text-blue-300/60">
        {value}
      </p>
    </button>
  );
}