import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function MeetingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [joining, setJoining] =
    useState(false);

  // ==========================================
  // Load meeting
  // ==========================================

  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/meetings/${id}`,
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
              "Unable to load meeting."
          );
        }

        setMeeting(data.meeting);

      } catch (error) {
        console.error(
          "Load meeting error:",
          error
        );

        setError(
          error.message ||
            "Unable to load meeting."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [id, navigate]);

  // ==========================================
  // Join meeting
  // ==========================================

  const handleJoin = () => {
    if (!meeting) {
      return;
    }

    setJoining(true);

    // If an external meeting URL exists,
    // open it in a new tab.
    if (meeting.meetingUrl) {
      window.open(
        meeting.meetingUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setJoining(false);
      return;
    }

    // Otherwise continue to the AI interview.
    navigate("/interview", {
      state: {
        meetingId: meeting.id,
        employeeEmail:
          meeting.employeeEmail,
        meetingTitle:
          meeting.title,
      },
    });
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="text-2xl font-bold">
            Loading meeting...
          </div>

          <p className="text-slate-400 mt-2">
            Please wait.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

        <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-red-400">
            Unable to open meeting
          </h1>

          <p className="text-slate-400 mt-3">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/meetings")
            }
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
          >
            Back to Meetings
          </button>

        </div>

      </div>
    );
  }

  if (!meeting) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <p className="text-blue-400 text-sm font-semibold">
              INTERVIEW ROOM
            </p>

            <h1 className="text-2xl font-bold">
              {meeting.title}
            </h1>

          </div>

          <button
            onClick={() =>
              navigate("/meetings")
            }
            className="border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg"
          >
            Back
          </button>

        </div>

      </header>

      {/* ================================= */}
      {/* Meeting */}
      {/* ================================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="grid md:grid-cols-2 gap-8">

            {/* Details */}

            <div>

              <p className="text-blue-400 text-sm font-semibold uppercase">
                Scheduled Interview
              </p>

              <h2 className="text-4xl font-black mt-2">
                {meeting.title}
              </h2>

              <div className="mt-8 space-y-4">

                <div>
                  <p className="text-slate-500 text-sm">
                    Employee
                  </p>

                  <p className="text-slate-200 mt-1">
                    {meeting.employeeEmail}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Scheduled time
                  </p>

                  <p className="text-slate-200 mt-1">
                    {new Date(
                      meeting.scheduledAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">
                    Status
                  </p>

                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold">
                    {meeting.status ||
                      "scheduled"}
                  </span>
                </div>

              </div>

            </div>

            {/* Join area */}

            <div className="bg-slate-800 rounded-2xl p-8 flex flex-col justify-center">

              <div className="text-center">

                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl">
                  🎥
                </div>

                <h3 className="text-2xl font-bold mt-5">
                  Ready to join?
                </h3>

                <p className="text-slate-400 mt-2">
                  Enter the interview room when
                  you are ready.
                </p>

                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-xl font-semibold"
                >
                  {joining
                    ? "Opening..."
                    : "Join Interview"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}