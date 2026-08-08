import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Meetings() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Load meetings
  // ==========================================

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const endpoint =
        user.role === "admin"
          ? "/api/meetings"
          : "/api/meetings/my";

      const response = await fetch(
        `${API_URL}${endpoint}`,
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
            "Unable to load meetings."
        );
      }

      setMeetings(
        data.meetings || []
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
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  // ==========================================
  // Delete meeting
  // ==========================================

  const deleteMeeting = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this meeting?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/meetings/${id}`,
        {
          method: "DELETE",

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
            "Unable to delete meeting."
        );
      }

      await loadMeetings();

    } catch (error) {
      console.error(
        "Delete meeting error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete meeting."
      );
    }
  };

  // ==========================================
  // Status color
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-500/10 text-green-400";
    }

    if (status === "cancelled") {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-blue-500/10 text-blue-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <p className="text-purple-400 text-sm font-semibold">
              MEETINGS
            </p>

            <h1 className="text-2xl font-bold">
              {user.role === "admin"
                ? "Manage Meetings"
                : "My Meetings"}
            </h1>
          </div>

          <button
            onClick={() =>
              navigate(
                user.role === "admin"
                  ? "/admin"
                  : "/employee"
              )
            }
            className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>

        </div>

      </header>

      {/* ================================= */}
      {/* Main */}
      {/* ================================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h2 className="text-4xl font-black">
              Meetings
            </h2>

            <p className="text-slate-400 mt-2">
              {user.role === "admin"
                ? "Schedule and manage employee interviews."
                : "View your scheduled interviews."}
            </p>
          </div>

          {user.role === "admin" && (
            <button
              onClick={() =>
                navigate(
                  "/meetings/create"
                )
              }
              className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold"
            >
              + Create Meeting
            </button>
          )}

        </div>

        {/* ================================= */}
        {/* Error */}
        {/* ================================= */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* Loading */}
        {/* ================================= */}

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            Loading meetings...
          </div>
        )}

        {/* ================================= */}
        {/* No meetings */}
        {/* ================================= */}

        {!loading &&
          meetings.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

              <h3 className="text-xl font-bold">
                No Meetings
              </h3>

              <p className="text-slate-400 mt-2">
                {user.role === "admin"
                  ? "Create a meeting to schedule an employee interview."
                  : "You do not have any scheduled meetings yet."}
              </p>

            </div>
          )}

        {/* ================================= */}
        {/* Meeting list */}
        {/* ================================= */}

        {!loading &&
          meetings.length > 0 && (

            <div className="space-y-4">

              {meetings.map(
                (meeting) => (

                  <div
                    key={meeting.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      {/* Meeting info */}

                      <div>

                        <h3 className="text-xl font-bold">
                          {meeting.title}
                        </h3>

                        <p className="text-slate-400 mt-2">
                          {user.role === "admin"
                            ? meeting.employee_email
                            : "Interview"}
                        </p>

                        <p className="text-slate-400 mt-1">
                          {meeting.scheduled_at
                            ? new Date(
                                meeting.scheduled_at
                              ).toLocaleString()
                            : "No scheduled time"}
                        </p>

                      </div>

                      {/* Status */}

                      <span
                        className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                          meeting.status
                        )}`}
                      >
                        {meeting.status ||
                          "scheduled"}
                      </span>

                      {/* Actions */}

                      <div className="flex flex-wrap gap-3">

                        {meeting.meeting_url && (
                          <button
                            onClick={() =>
                              window.open(
                                meeting.meeting_url,
                                "_blank"
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
                          >
                            Join Meeting
                          </button>
                        )}

                        {user.role ===
                          "admin" && (
                          <>
                            <button
                              onClick={() =>
                                navigate(
                                  `/meetings/${meeting.id}`
                                )
                              }
                              className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                deleteMeeting(
                                  meeting.id
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
                            >
                              Delete
                            </button>
                          </>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        {/* ================================= */}
        {/* Refresh */}
        {/* ================================= */}

        {!loading && (
          <div className="mt-8">

            <button
              onClick={loadMeetings}
              className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
            >
              Refresh Meetings
            </button>

          </div>
        )}

      </main>

    </div>
  );
}