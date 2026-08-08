  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          employeeRequestId:
            selectedRequest.id,

          employeeName:
            selectedRequest.name || "Employee",

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to schedule meeting."
      );
    }

    setScheduleMessage(
      "Meeting scheduled successfully."
    );

    // Refresh employee requests
    await loadRequests();

    // Close modal after successful scheduling
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

    return (
      <div className="min-h-screen bg-slate-950 text-white">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <header className="border-b border-slate-800 bg-slate-900">

          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

            <div>
              <p className="text-purple-400 text-sm font-semibold">
                ADMIN
              </p>

              <h1 className="text-2xl font-bold">
                Admin Dashboard
              </h1>
            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

        </header>

        {/* ================================= */}
        {/* Main */}
        {/* ================================= */}

        <main className="max-w-7xl mx-auto px-6 py-10">

          <h2 className="text-4xl font-black">
            Welcome, {user.name || "Admin"}
          </h2>

          <p className="text-slate-400 mt-2">
            Manage employees, interviews and meetings.
          </p>

          {/* ================================= */}
          {/* Dashboard Cards */}
          {/* ================================= */}

          <div className="grid md:grid-cols-3 gap-6 mt-10">

            <button
              onClick={() =>
                document
                  .getElementById(
                    "employee-requests"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
            >
              <h3 className="text-xl font-bold">
                Interview Requests
              </h3>

              <p className="text-slate-400 mt-2">
                Review employee requests and resumes.
              </p>

              <p className="text-blue-400 mt-4 font-semibold">
                {requests.length} Request
                {requests.length === 1
                  ? ""
                  : "s"}
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/meetings")
              }
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 transition"
            >
              <h3 className="text-xl font-bold">
                Meetings
              </h3>

              <p className="text-slate-400 mt-2">
                Schedule and manage interviews.
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/report")
              }
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition"
            >
              <h3 className="text-xl font-bold">
                AI Reports
              </h3>

              <p className="text-slate-400 mt-2">
                Review AI interview scores and reports.
              </p>
            </button>

          </div>

          {/* ================================= */}
          {/* Employee Requests */}
          {/* ================================= */}

          <section
            id="employee-requests"
            className="mt-14"
          >

            <div className="flex items-center justify-between mb-6">

              <div>
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
                  Employee Requests
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Interview Requests
                </h2>
              </div>

              <button
                onClick={loadRequests}
                className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm"
              >
                Refresh
              </button>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
                {error}
              </div>
            )}

            {/* Loading */}

            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                Loading employee requests...
              </div>
            )}

            {/* No requests */}

            {!loading &&
              requests.length === 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                  <h3 className="text-xl font-bold">
                    No Employee Requests
                  </h3>

                  <p className="text-slate-400 mt-2">
                    New employee interview requests
                    will appear here.
                  </p>

                </div>
              )}

            {/* Requests */}

            {!loading &&
              requests.length > 0 && (

                <div className="space-y-4">

                  {requests.map(
                    (request) => (

                      <div
                        key={request.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                          {/* Employee */}

                          <div>

                            <h3 className="text-xl font-bold">
                              {request.name}
                            </h3>

                            <p className="text-slate-400 mt-1">
                              {request.email}
                            </p>

                            <p className="text-slate-500 text-sm mt-2">
                              Requested:{" "}
                              {request.createdAt
                                ? new Date(
                                    request.createdAt
                                  ).toLocaleString()
                                : "Unknown"}
                            </p>

                          </div>

                          {/* Status */}

                          <div>

                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                request.status ===
                                "accepted"
                                  ? "bg-green-500/10 text-green-400"
                                  : request.status ===
                                    "rejected"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {request.status ||
                                "pending"}
                            </span>

                          </div>

                          {/* AI Score */}

                          <div>

                            <p className="text-slate-500 text-sm">
                              AI Score
                            </p>

                            <p className="text-2xl font-bold">
                              {request.aiScore !==
                                null &&
                              request.aiScore !==
                                undefined
                                ? request.aiScore
                                : "—"}
                            </p>

                          </div>

                          {/* Actions */}

                          <div className="flex flex-wrap gap-3">

                            {request.status ===
                              "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateRequestStatus(
                                      request.id,
                                      "accepted"
                                    )
                                  }
                                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
                                >
                                  Accept
                                </button>

                                <button
                                  onClick={() =>
                                    updateRequestStatus(
                                      request.id,
                                      "rejected"
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {request.status ===
                              "accepted" && (
                              <button
                                onClick={() =>
                                  openScheduleModal(
                                    request
                                  )
                                }
                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
                              >
                                Schedule Meeting
                              </button>
                            )}

                          </div>

                        </div>

                        {/* Resume */}

                        <div className="mt-5 pt-5 border-t border-slate-800">

                          <p className="text-sm text-slate-500">
                            Resume
                          </p>

                          {request.resume?.url ? (

                            <a
                              href={
                                request.resume.url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 mt-1 inline-block"
                            >
                              View Resume
                            </a>

                          ) : (

                            <p className="text-slate-500 mt-1">
                              No resume uploaded yet.
                            </p>

                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

          </section>

        </main>

        {/* ================================= */}
        {/* Schedule Meeting Modal */}
        {/* ================================= */}

        {selectedRequest && (

          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">

            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-purple-400 text-sm font-semibold uppercase">
                    Schedule Interview
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {selectedRequest.name}
                  </h2>

                  <p className="text-slate-400 text-sm mt-1">
                    {selectedRequest.email}
                  </p>
                </div>

                <button
                  onClick={
                    closeScheduleModal
                  }
                  className="text-slate-400 hover:text-white text-xl"
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={scheduleMeeting}
                className="mt-6 space-y-5"
              >

                {/* Title */}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Meeting Title
                  </label>

                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) =>
                      setMeetingTitle(
                        e.target.value
                      )
                    }
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Description
                  </label>

                  <textarea
                    value={
                      meetingDescription
                    }
                    onChange={(e) =>
                      setMeetingDescription(
                        e.target.value
                      )
                    }
                    rows="3"
                    placeholder="Interview instructions..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                {/* Date/time */}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) =>
                      setScheduledAt(
                        e.target.value
                      )
                    }
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                {/* Duration */}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Duration
                  </label>

                  <select
                    value={
                      durationMinutes
                    }
                    onChange={(e) =>
                      setDurationMinutes(
                        e.target.value
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

                {/* Message */}

                {scheduleMessage && (
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl p-4">
                    {scheduleMessage}
                  </div>
                )}

                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={
                      closeScheduleModal
                    }
                    disabled={scheduling}
                    className="border border-slate-700 hover:bg-slate-800 px-5 py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={scheduling}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold"
                  >
                    {scheduling
                      ? "Scheduling..."
                      : "Schedule Meeting"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
    );
  }