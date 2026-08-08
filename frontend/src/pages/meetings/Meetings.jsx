import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Meetings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Load user
  // ==========================================

  useEffect(() => {
    try {
      const storedUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      setUser(storedUser);
    } catch (error) {
      console.error(
        "Unable to read user:",
        error
      );

      setUser({});
    }
  }, []);

  // ==========================================
  // Load meetings
  // ==========================================

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      const storedUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      let endpoint = "";

      if (
        storedUser.role ===
        "admin"
      ) {
        endpoint =
          "/api/meetings";
      } else if (
        storedUser.role ===
        "employee"
      ) {
        endpoint =
          "/api/meetings/my";
      } else {
        throw new Error(
          "Invalid user role."
        );
      }

      console.log(
        "Loading meetings:",
        `${API_URL}${endpoint}`
      );

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

      const text =
        await response.text();

      let data = {};

      try {
        data =
          text
            ? JSON.parse(text)
            : {};
      } catch {
        data = {};
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
    }
  };

  // ==========================================
  // Initial load
  // ==========================================

  useEffect(() => {
    loadMeetings();
  }, []);

  // ==========================================
  // Delete meeting
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
          `${API_URL}/api/meetings/${id}`,
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
  // Status
  // ==========================================

  const getStatusClass = (
    status
  ) => {
    if (
      status ===
      "completed"
    ) {
      return "bg-green-500/10 text-green-400";
    }

    if (
      status ===
      "cancelled"
    ) {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-blue-500/10 text-blue-400";
  };

  // ==========================================
  // Dashboard
  // ==========================================

  const goToDashboard = () => {
    if (
      user.role ===
      "admin"
    ) {
      navigate("/admin");
      return;
    }

    if (
      user.role ===
      "employee"
    ) {
      navigate("/employee");
      return;
    }

    navigate("/login");
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

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
            onClick={
              goToDashboard
            }
            className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>

        </div>

      </header>

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

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            Loading meetings...
          </div>
        )}

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

        {!loading &&
          meetings.length > 0 && (
            <div className="space-y-4">

              {meetings.map(
                (meeting) => (
                  <div
                    key={
                      meeting.id
                    }
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            meeting.title
                          }
                        </h3>

                        <p className="text-slate-400 mt-2">
                          {user.role ===
                          "admin"
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

                        {meeting.duration_minutes && (
                          <p className="text-slate-500 text-sm mt-1">
                            Duration:{" "}
                            {
                              meeting.duration_minutes
                            }{" "}
                            minutes
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                          meeting.status
                        )}`}
                      >
                        {meeting.status ||
                          "scheduled"}
                      </span>

                      <div className="flex flex-wrap gap-3">

                        {meeting.meeting_url && (
                          <button
                            onClick={() =>
                              window.open(
                                meeting.meeting_url,
                                "_blank",
                                "noopener,noreferrer"
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

        {!loading && (
          <div className="mt-8">

            <button
              onClick={
                loadMeetings
              }
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