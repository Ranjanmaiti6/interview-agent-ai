import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function Meetings() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Get logged-in user
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
  // Load meetings
  // ==========================================

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Admin gets all meetings.
      // Employee gets only their meetings.
      const endpoint =
        user.role === "employee"
          ? "/api/meetings/my"
          : "/api/meetings";

      console.log(
        "Loading meetings:",
        `${API_URL}${endpoint}`
      );

      const response = await fetch(
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

      const data =
        await response.json();

      console.log(
        "Meetings API response:",
        data
      );

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
    }
  };

  // ==========================================
  // Load on page open
  // ==========================================

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

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-500/10 text-green-400";
    }

    if (status === "cancelled") {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-blue-500/10 text-blue-400";
  };

  // ==========================================
  // Dashboard
  // ==========================================

  const goToDashboard = () => {
    if (user.role === "admin") {
      navigate("/admin");
      return;
    }

    if (user.role === "employee") {
      navigate("/employee");
      return;
    }

    navigate("/");
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

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
            onClick={goToDashboard}
            className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>

        </div>

      </header>

      {/* ====================================== */}
      {/* MAIN */}
      {/* ====================================== */}

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
                navigate("/meetings/create")
              }
              className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold"
            >
              + Create Meeting
            </button>
          )}

        </div>

        {/* ====================================== */}
        {/* ERROR */}
        {/* ====================================== */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ====================================== */}
        {/* LOADING */}
        {/* ====================================== */}

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            Loading meetings...
          </div>
        )}

        {/* ====================================== */}
        {/* EMPTY */}
        {/* ====================================== */}

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

        {/* ====================================== */}
        {/* MEETINGS */}
        {/* ====================================== */}

        {!loading &&
          meetings.length > 0 && (
            <div className="space-y-4">

              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* Meeting information */}

                    <div className="flex-1">

                      <h3 className="text-xl font-bold">
                        {meeting.title}
                      </h3>

                      {user.role === "admin" && (
                        <>
                          <p className="text-slate-400 mt-2">
                            {meeting.employee_name ||
                              "Employee"}
                          </p>

                          <p className="text-slate-500 text-sm">
                            {meeting.employee_email}
                          </p>
                        </>
                      )}

                      <p className="text-slate-400 mt-2">
                        {meeting.scheduled_at
                          ? new Date(
                              meeting.scheduled_at
                            ).toLocaleString()
                          : "No scheduled time"}
                      </p>

                      <p className="text-slate-500 text-sm mt-1">
                        {meeting.duration_minutes ||
                          30}{" "}
                        minutes
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

                      <button
                        onClick={() =>
                          navigate(
                            `/meetings/${meeting.id}`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                      >
                        {meeting.meeting_url
                          ? "Join Meeting"
                          : "Open Meeting"}
                      </button>

                      {user.role === "admin" && (
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
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        {/* ====================================== */}
        {/* REFRESH */}
        {/* ====================================== */}

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