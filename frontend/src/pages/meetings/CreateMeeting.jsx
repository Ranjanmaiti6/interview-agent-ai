import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function CreateMeeting() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

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

  // ==========================================
  // Load accepted employees
  // ==========================================

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/employee/requests`,
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load employees."
        );
      }

      const accepted =
        (
          data.requests ||
          []
        ).filter(
          (request) =>
            request.status ===
            "accepted"
        );

      setRequests(
        accepted
      );

    } catch (error) {
      console.error(
        "Load employees error:",
        error
      );

      setError(
        error.message ||
        "Unable to load employees."
      );

    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // Employee selection
  // ==========================================

  const handleEmployeeChange = (
    event
  ) => {
    const selectedEmail =
      event.target.value;

    setEmployeeEmail(
      selectedEmail
    );

    const selectedRequest =
      requests.find(
        (request) =>
          request.email ===
          selectedEmail
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

  // ==========================================
  // Create meeting
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !title.trim() ||
      !employeeEmail ||
      !scheduledAt
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    setLoading(true);

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate("/login");
        return;
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

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              employeeRequestId:
                employeeRequestId ||
                null,

              employeeName:
                employeeName ||
                "Employee",

              employeeEmail:
                employeeEmail,

              title:
                title.trim(),

              description:
                null,

              scheduledAt:
                scheduledAt,

              durationMinutes:
                Number(
                  durationMinutes
                ) || 30,

              meetingUrl:
                meetingUrl.trim() ||
                null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to create meeting."
        );
      }

      setSuccess(
        "Meeting scheduled successfully."
      );

      setTitle(
        "AI Interview"
      );

      setEmployeeEmail("");
      setEmployeeRequestId("");
      setEmployeeName("");
      setScheduledAt("");
      setDurationMinutes("30");
      setMeetingUrl("");

    } catch (error) {
      console.error(
        "Create meeting error:",
        error
      );

      setError(
        error.message ||
        "Unable to create meeting."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <p className="text-purple-400 text-sm font-semibold">
              ADMIN
            </p>

            <h1 className="text-2xl font-bold">
              Create Meeting
            </h1>
          </div>

          <button
            onClick={() =>
              navigate(
                "/meetings"
              )
            }
            className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
          >
            Back to Meetings
          </button>

        </div>

      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-4xl font-black">
            Schedule Interview
          </h2>

          <p className="text-slate-400 mt-2">
            Schedule an interview with an
            accepted employee.
          </p>

        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4">
            {success}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
        >

          {/* Title */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Meeting Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="AI Interview"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

          {/* Employee */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Employee
            </label>

            {loadingRequests ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400">
                Loading accepted employees...
              </div>
            ) : requests.length ===
              0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl p-4">
                No accepted employee
                requests are available.
              </div>
            ) : (
              <select
                value={
                  employeeEmail
                }
                onChange={
                  handleEmployeeChange
                }
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
              >

                <option value="">
                  Select employee
                </option>

                {requests.map(
                  (request) => (
                    <option
                      key={
                        request.id
                      }
                      value={
                        request.email
                      }
                    >
                      {
                        request.name
                      }{" "}
                      —{" "}
                      {
                        request.email
                      }
                    </option>
                  )
                )}

              </select>
            )}

          </div>

          {/* Date/time */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Interview Date & Time
            </label>

            <input
              type="datetime-local"
              value={
                scheduledAt
              }
              onChange={(event) =>
                setScheduledAt(
                  event.target.value
                )
              }
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

          {/* Duration */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
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

          {/* Meeting URL */}

          <div className="mb-8">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Meeting URL
              <span className="text-slate-500 font-normal">
                {" "}
                (optional)
              </span>
            </label>

            <input
              type="url"
              value={
                meetingUrl
              }
              onChange={(event) =>
                setMeetingUrl(
                  event.target.value
                )
              }
              placeholder="https://meet.google.com/..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row justify-end gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/meetings"
                )
              }
              className="border border-slate-700 hover:bg-slate-800 px-5 py-3 rounded-xl"
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
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Scheduling..."
                : "Schedule Interview"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}