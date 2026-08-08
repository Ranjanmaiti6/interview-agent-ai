import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileText,
  LogOut,
  CalendarDays,
  BarChart3,
  Upload,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "");

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // Logged-in user
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

  // ==========================================
  // State
  // ==========================================

  const [requestStatus, setRequestStatus] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resume, setResume] =
    useState(null);

  const [myRequest, setMyRequest] =
    useState(null);

  const [requestLoading, setRequestLoading] =
    useState(true);

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // Load interview request
  // ==========================================

  const loadMyRequest = async () => {
    try {
      setRequestLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/employee/my-request`,
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
            "Unable to load interview request."
        );
      }

      setMyRequest(
        data.request || null
      );
    } catch (error) {
      console.error(
        "Load my request error:",
        error
      );
    } finally {
      setRequestLoading(false);
    }
  };

  // ==========================================
  // Load request on dashboard
  // ==========================================

  useEffect(() => {
    loadMyRequest();
  }, []);

  // ==========================================
  // Resume selection
  // ==========================================

  const handleResumeChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
    ];

    const validType =
      allowedTypes.includes(
        file.type
      ) ||
      allowedExtensions.includes(
        extension
      );

    if (!validType) {
      setResume(null);

      setRequestStatus(
        "Please upload a PDF, DOC, or DOCX resume."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setResume(null);

      setRequestStatus(
        "Resume must be smaller than 5 MB."
      );

      event.target.value = "";

      return;
    }

    setResume(file);
    setRequestStatus("");
  };

  // ==========================================
  // Submit interview request
  // ==========================================

  const submitInterviewRequest =
    async () => {
      if (myRequest?.status === "accepted") {
        setRequestStatus(
          "Your interview request has already been accepted."
        );

        return;
      }

      if (!resume) {
        setRequestStatus(
          "Please upload your resume before submitting the request."
        );

        return;
      }

      setLoading(true);
      setRequestStatus("");

      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const formData =
          new FormData();

        formData.append(
          "name",
          user.name || "Employee"
        );

        formData.append(
          "email",
          user.email || ""
        );

        formData.append(
          "resume",
          resume
        );

        const response =
          await fetch(
            `${API_URL}/api/employee/request`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: formData,
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
              "Unable to submit request."
          );
        }

        setRequestStatus(
          "Request submitted successfully. The admin will review your resume and request."
        );

        setResume(null);

        const fileInput =
          document.getElementById(
            "resume-upload"
          );

        if (fileInput) {
          fileInput.value = "";
        }

        await loadMyRequest();
      } catch (error) {
        console.error(
          "Request error:",
          error
        );

        setRequestStatus(
          error.message ||
            "Unable to submit request."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // Status configuration
  // ==========================================

  const getStatusConfig = () => {
    if (
      myRequest?.status ===
      "accepted"
    ) {
      return {
        label: "Accepted",
        icon: CheckCircle2,
        color: "text-emerald-300",
        bg: "bg-emerald-400/[0.07]",
        border:
          "border-emerald-400/15",
        dot: "bg-emerald-400",
      };
    }

    if (
      myRequest?.status ===
      "rejected"
    ) {
      return {
        label: "Rejected",
        icon: XCircle,
        color: "text-red-300",
        bg: "bg-red-400/[0.07]",
        border:
          "border-red-400/15",
        dot: "bg-red-400",
      };
    }

    return {
      label: "Pending",
      icon: Clock3,
      color: "text-amber-300",
      bg: "bg-amber-400/[0.07]",
      border:
        "border-amber-400/15",
      dot: "bg-amber-400",
    };
  };

  const statusConfig =
    getStatusConfig();

  const StatusIcon =
    statusConfig.icon;

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">

      {/* ======================================
          Background
      ====================================== */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-12%] top-[-15%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[150px]" />

        <div className="absolute right-[-15%] top-[25%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[150px]" />

        <div className="absolute bottom-[-20%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.025] blur-[160px]" />

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

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* ======================================
          Header
      ====================================== */}

      <header className="relative z-20 border-b border-white/[0.06] bg-[#05070a]/75 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

          {/* Brand */}

          <button
            type="button"
            onClick={() =>
              navigate("/employee")
            }
            className="group flex items-center gap-3"
          >

            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/[0.06]">

              <BrainCircuit
                size={21}
                strokeWidth={1.5}
                className="text-blue-300 transition-transform duration-500 group-hover:scale-110"
              />

              <span className="absolute inset-0 rounded-xl bg-blue-400/[0.05] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

            </div>

            <div className="text-left">

              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-300/70">
                AI Interview
              </p>

              <p className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-white">
                Employee Portal
              </p>

            </div>

          </button>

          {/* Header actions */}

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 sm:flex">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Session active
              </span>

            </div>

            <button
              type="button"
              onClick={logout}
              className="group flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-medium text-white/55 transition-all duration-300 hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-300"
            >

              <LogOut
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />

              <span className="hidden sm:inline">
                Logout
              </span>

            </button>

          </div>

        </div>

      </header>

      {/* ======================================
          Main
      ====================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

        {/* ======================================
            Hero
        ====================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-10 lg:p-12">

          <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[350px] w-[350px] rounded-full bg-blue-500/[0.06] blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/10 bg-blue-300/[0.05] px-3 py-1.5">

                <Sparkles
                  size={12}
                  className="text-blue-300"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/75">
                  Candidate workspace
                </span>

              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">

                Welcome back,{" "}

                <span className="text-white/35">
                  {user.name ||
                    "Employee"}
                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                Manage your interview request,
                prepare your resume, and access
                your AI-powered interview workspace
                from one place.
              </p>

            </div>

            {/* Profile */}

            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 lg:min-w-[240px]">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/[0.07] text-lg font-semibold text-blue-200">

                {(user.name ||
                  "E")
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-white/80">
                  {user.name ||
                    "Employee"}
                </p>

                <p className="mt-1 truncate text-xs text-white/30">
                  {user.email ||
                    "Employee account"}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================
            Quick actions
        ====================================== */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <DashboardAction
            icon={BrainCircuit}
            label="AI Interview"
            description="Start your adaptive technical interview."
            accent="blue"
            onClick={() =>
              navigate("/interview")
            }
          />

          <DashboardAction
            icon={CalendarDays}
            label="My Meetings"
            description="View and join scheduled meetings."
            accent="cyan"
            onClick={() =>
              navigate("/meetings")
            }
          />

          <DashboardAction
            icon={BarChart3}
            label="My Results"
            description="Review your interview performance."
            accent="emerald"
            onClick={() =>
              navigate("/report")
            }
          />

        </section>

        {/* ======================================
            Request + Resume
        ====================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* Request status */}

          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:p-8">

            <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-blue-500/[0.045] blur-[70px]" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={15}
                      className="text-blue-300"
                    />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                      Request status
                    </p>

                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                    My interview request
                  </h2>

                </div>

                {!requestLoading &&
                  myRequest && (
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${statusConfig.border} ${statusConfig.bg}`}
                    >
                      <StatusIcon
                        size={17}
                        className={
                          statusConfig.color
                        }
                      />
                    </div>
                  )}

              </div>

              {requestLoading ? (

                <div className="mt-10 flex items-center gap-3 text-sm text-white/35">

                  <Loader2
                    size={16}
                    className="animate-spin text-blue-300"
                  />

                  Loading request status...

                </div>

              ) : !myRequest ? (

                <div className="mt-8 rounded-2xl border border-white/[0.06] bg-black/20 p-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">

                      <FileText
                        size={16}
                        className="text-white/40"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-medium text-white/70">
                        No request submitted
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/30">
                        Upload your resume to begin
                        the interview request process.
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="mt-8">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-white/35">
                      Current status
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusConfig.border} ${statusConfig.bg} ${statusConfig.color}`}
                    >

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                      />

                      {statusConfig.label}

                    </span>

                  </div>

                  <div className="mt-5 h-px bg-white/[0.06]" />

                  <div className="mt-5 flex items-center gap-3">

                    <Clock3
                      size={14}
                      className="text-white/25"
                    />

                    <p className="text-xs text-white/30">

                      Submitted{" "}

                      <span className="text-white/55">
                        {myRequest.createdAt
                          ? new Date(
                              myRequest.createdAt
                            ).toLocaleString()
                          : "Unknown"}
                      </span>

                    </p>

                  </div>

                  {myRequest.status ===
                    "pending" && (
                    <StatusMessage
                      type="pending"
                      title="Waiting for admin review"
                      text="Your resume and interview request are currently being reviewed."
                    />
                  )}

                  {myRequest.status ===
                    "accepted" && (
                    <>
                      <StatusMessage
                        type="accepted"
                        title="Interview request accepted"
                        text="Your request has been accepted. You can now continue with your scheduled interview."
                      />

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/meetings")
                        }
                        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
                      >
                        View My Meetings

                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </button>
                    </>
                  )}

                  {myRequest.status ===
                    "rejected" && (
                    <StatusMessage
                      type="rejected"
                      title="Interview request rejected"
                      text="Your interview request was rejected by the admin. You may submit a new request with an updated resume."
                    />
                  )}

                </div>

              )}

            </div>

          </div>

          {/* ======================================
              Resume request
          ====================================== */}

          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:p-8">

            <div className="pointer-events-none absolute bottom-[-100px] right-[-70px] h-64 w-64 rounded-full bg-blue-500/[0.045] blur-[90px]" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                    <Upload
                      size={15}
                      className="text-blue-300"
                    />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                      Interview request
                    </p>

                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                    {myRequest?.status ===
                    "accepted"
                      ? "Interview approved"
                      : "Prepare your profile"}
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">

                    {myRequest?.status ===
                    "accepted"
                      ? "Your profile has been approved. View your meetings to see the next interview session."
                      : "Upload your latest resume so the admin can review your profile before scheduling the interview."}

                  </p>

                </div>

                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-300/10 bg-blue-400/[0.05] sm:flex">

                  {myRequest?.status ===
                  "accepted" ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-300"
                    />
                  ) : (
                    <FileText
                      size={18}
                      className="text-blue-300"
                    />
                  )}

                </div>

              </div>

              {myRequest?.status ===
              "accepted" ? (

                /* Approved state */

                <div className="mt-7 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-6">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05]">

                      <CheckCircle2
                        size={19}
                        className="text-emerald-300"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-emerald-300">
                        Interview request accepted
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/30">
                        Your resume has been reviewed
                        and your interview request has
                        been approved.
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/meetings")
                    }
                    className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_35px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    Open Interview Schedule

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </button>

                </div>

              ) : (

                /* Resume upload */

                <>
                  <label
                    htmlFor="resume-upload"
                    className="group mt-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-black/20 px-5 py-8 text-center transition-all duration-300 hover:border-blue-300/25 hover:bg-blue-400/[0.025]"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] transition-all duration-300 group-hover:border-blue-300/15 group-hover:bg-blue-400/[0.06]">

                      <Upload
                        size={19}
                        className="text-white/35 transition-colors duration-300 group-hover:text-blue-300"
                      />

                    </div>

                    <p className="mt-4 text-sm font-medium text-white/65">

                      {resume
                        ? "Resume selected"
                        : "Choose your resume"}

                    </p>

                    <p className="mt-1 max-w-md text-xs text-white/25">

                      {resume
                        ? resume.name
                        : "PDF, DOC or DOCX · Maximum 5 MB"}

                    </p>

                    <span className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35 transition-colors duration-300 group-hover:text-white/55">
                      Browse files
                    </span>

                  </label>

                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={
                      handleResumeChange
                    }
                    className="sr-only"
                  />

                  {resume && (

                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3.5">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.05]">

                        <CheckCircle2
                          size={16}
                          className="text-emerald-300"
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-semibold text-emerald-300/80">
                          Resume ready
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-white/30">
                          {resume.name}
                        </p>

                      </div>

                    </div>

                  )}

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/20">

                      <ShieldCheck
                        size={12}
                      />

                      Secure submission

                    </div>

                    <button
                      type="button"
                      onClick={
                        submitInterviewRequest
                      }
                      disabled={loading}
                      className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_16px_45px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-40"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />

                          Submitting...
                        </>
                      ) : (
                        <>
                          Request Interview

                          <ArrowUpRight
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </>
                      )}

                    </button>

                  </div>

                  {requestStatus && (

                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-4">

                      <AlertTriangle
                        size={15}
                        className="mt-0.5 shrink-0 text-blue-300"
                      />

                      <p className="text-xs leading-5 text-blue-200/65">
                        {requestStatus}
                      </p>

                    </div>

                  )}

                </>
              )}

            </div>

          </div>

        </section>

        {/* ======================================
            Footer status
        ====================================== */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />

            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
              AI Interview System Operational
            </span>

          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/15">
            Candidate Workspace / Secure Session
          </p>

        </div>

      </main>

    </div>
  );
}

// ==========================================
// Dashboard action
// ==========================================

function DashboardAction({
  icon: Icon,
  label,
  description,
  accent,
  onClick,
}) {
  const accentClasses = {
    blue: {
      icon: "text-blue-300",
      border:
        "hover:border-blue-400/20",
      bg:
        "group-hover:bg-blue-400/[0.035]",
    },

    cyan: {
      icon: "text-cyan-300",
      border:
        "hover:border-cyan-400/20",
      bg:
        "group-hover:bg-cyan-400/[0.035]",
    },

    emerald: {
      icon: "text-emerald-300",
      border:
        "hover:border-emerald-400/20",
      bg:
        "group-hover:bg-emerald-400/[0.035]",
    },
  };

  const styles =
    accentClasses[accent] ||
    accentClasses.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.018] p-5 text-left backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${styles.border} ${styles.bg}`}
    >

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-black/20">

          <Icon
            size={18}
            strokeWidth={1.5}
            className={styles.icon}
          />

        </div>

        <ArrowUpRight
          size={16}
          className="text-white/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/55"
        />

      </div>

      <h3 className="mt-5 text-sm font-semibold text-white/80">
        {label}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-white/30">
        {description}
      </p>

    </button>
  );
}

// ==========================================
// Status message
// ==========================================

function StatusMessage({
  type,
  title,
  text,
}) {
  const config = {
    pending: {
      border:
        "border-amber-400/10",
      bg:
        "bg-amber-400/[0.035]",
      icon:
        Clock3,
      color:
        "text-amber-300",
    },

    accepted: {
      border:
        "border-emerald-400/10",
      bg:
        "bg-emerald-400/[0.035]",
      icon:
        CheckCircle2,
      color:
        "text-emerald-300",
    },

    rejected: {
      border:
        "border-red-400/10",
      bg:
        "bg-red-400/[0.035]",
      icon:
        XCircle,
      color:
        "text-red-300",
    },
  };

  const current =
    config[type] ||
    config.pending;

  const Icon =
    current.icon;

  return (
    <div
      className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${current.border} ${current.bg}`}
    >

      <Icon
        size={16}
        className={`mt-0.5 shrink-0 ${current.color}`}
      />

      <div>

        <p
          className={`text-xs font-semibold ${current.color}`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/30">
          {text}
        </p>

      </div>

    </div>
  );
}