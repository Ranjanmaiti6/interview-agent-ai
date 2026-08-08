import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Link2,
  User,
  Video,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function CreateMeeting() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] =
    useState(true);

  const [title, setTitle] =
    useState("AI Interview");

  const [employeeEmail, setEmployeeEmail] =
    useState("");

  const [employeeRequestId, setEmployeeRequestId] =
    useState("");

  const [employeeName, setEmployeeName] =
    useState("");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [durationMinutes, setDurationMinutes] =
    useState("30");

  const [meetingUrl, setMeetingUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const token =
        localStorage.getItem("token");

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
            "Unable to load employees."
        );
      }

      const accepted = (
        data.requests || []
      ).filter(
        (request) =>
          request.status === "accepted"
      );

      setRequests(accepted);
    } catch (err) {
      console.error(
        "Load employees error:",
        err
      );

      setError(
        err.message ||
          "Unable to load employees."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleEmployeeChange = (event) => {
    const selectedEmail =
      event.target.value;

    setEmployeeEmail(selectedEmail);

    const selectedRequest =
      requests.find(
        (request) =>
          request.email === selectedEmail
      );

    if (selectedRequest) {
      setEmployeeRequestId(
        selectedRequest.id || ""
      );

      setEmployeeName(
        selectedRequest.name ||
          "Employee"
      );
    } else {
      setEmployeeRequestId("");
      setEmployeeName("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError(
        "Please enter a meeting title."
      );
      return;
    }

    if (!employeeEmail) {
      setError(
        "Please select an employee."
      );
      return;
    }

    if (!scheduledAt) {
      setError(
        "Please select the interview date and time."
      );
      return;
    }

    const selectedDate =
      new Date(scheduledAt);

    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {
      setError(
        "Please select a valid date and time."
      );
      return;
    }

    if (
      meetingUrl.trim() &&
      !isValidUrl(meetingUrl.trim())
    ) {
      setError(
        "Please enter a valid meeting URL."
      );
      return;
    }

    setLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
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
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            employeeRequestId:
              employeeRequestId || null,

            employeeName:
              employeeName ||
              "Employee",

            employeeEmail,

            title: title.trim(),

            description: null,

            scheduledAt,

            durationMinutes:
              Number(durationMinutes) ||
              30,

            meetingUrl:
              meetingUrl.trim() ||
              null,
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
            "Unable to create meeting."
        );
      }

      setSuccess(
        "Meeting scheduled successfully."
      );

      setTitle("AI Interview");
      setEmployeeEmail("");
      setEmployeeRequestId("");
      setEmployeeName("");
      setScheduledAt("");
      setDurationMinutes("30");
      setMeetingUrl("");
    } catch (err) {
      console.error(
        "Create meeting error:",
        err
      );

      setError(
        err.message ||
          "Unable to create meeting."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#090b0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-400">
              Admin
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Create Meeting
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/meetings")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-white/60 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-purple-500" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-400">
              Meeting Management
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Schedule Interview
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
            Schedule an interview with an accepted
            employee and optionally attach an external
            meeting link.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.02] shadow-[0_30px_100px_rgba(0,0,0,0.3)]"
        >
          <div className="border-b border-white/[0.06] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/[0.05]">
                <Video
                  size={18}
                  className="text-purple-300"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Interview configuration
                </p>

                <p className="mt-0.5 text-xs text-white/25">
                  Configure the interview session.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-6 sm:p-8">
            {/* Title */}
            <Field
              icon={Video}
              label="Meeting Title"
            >
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="AI Interview"
                required
                className={inputClass}
              />
            </Field>

            {/* Employee */}
            <Field
              icon={User}
              label="Employee"
            >
              {loadingRequests ? (
                <div className={inputClass}>
                  Loading accepted employees...
                </div>
              ) : requests.length === 0 ? (
                <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/[0.05] p-4 text-sm text-yellow-300">
                  No accepted employee requests
                  are available.
                </div>
              ) : (
                <select
                  value={employeeEmail}
                  onChange={
                    handleEmployeeChange
                  }
                  required
                  className={inputClass}
                >
                  <option value="">
                    Select employee
                  </option>

                  {requests.map(
                    (request) => (
                      <option
                        key={request.id}
                        value={request.email}
                      >
                        {request.name} —{" "}
                        {request.email}
                      </option>
                    )
                  )}
                </select>
              )}
            </Field>

            {/* Date */}
            <Field
              icon={CalendarDays}
              label="Interview Date & Time"
            >
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) =>
                  setScheduledAt(
                    event.target.value
                  )
                }
                required
                className={inputClass}
              />
            </Field>

            {/* Duration */}
            <Field
              icon={Clock3}
              label="Duration"
            >
              <select
                value={durationMinutes}
                onChange={(event) =>
                  setDurationMinutes(
                    event.target.value
                  )
                }
                className={inputClass}
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

            {/* URL */}
            <Field
              icon={Link2}
              label={
                <>
                  Meeting URL{" "}
                  <span className="font-normal text-white/20">
                    (optional)
                  </span>
                </>
              }
            >
              <input
                type="url"
                value={meetingUrl}
                onChange={(event) =>
                  setMeetingUrl(
                    event.target.value
                  )
                }
                placeholder="https://meet.google.com/..."
                className={inputClass}
              />

              <p className="mt-2 text-xs text-white/20">
                Leave empty to use the internal
                AI interview flow.
              </p>
            </Field>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate("/meetings")
                }
                className="rounded-xl border border-white/[0.08] px-6 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  loadingRequests ||
                  requests.length === 0
                }
                className="rounded-xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Scheduling..."
                  : "Schedule Interview"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/40 focus:bg-white/[0.05]";

function Field({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
        <Icon
          size={15}
          className="text-purple-300/70"
        />

        {label}
      </label>

      {children}
    </div>
  );
}

function isValidUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}