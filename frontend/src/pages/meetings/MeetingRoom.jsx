import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Video,
  User,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function MeetingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadMeeting = async () => {
      try {
        if (!id) {
          throw new Error("Meeting ID is missing.");
        }

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/meetings/${encodeURIComponent(id)}`,
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
              `Unable to load meeting. HTTP ${response.status}`
          );
        }

        if (!data.meeting) {
          throw new Error(
            "Meeting was not returned by the server."
          );
        }

        if (!cancelled) {
          setMeeting(data.meeting);
        }
      } catch (err) {
        console.error("Load meeting error:", err);

        if (!cancelled) {
          setError(
            err.message || "Unable to load meeting."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMeeting();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleJoin = () => {
    if (!meeting || joining) {
      return;
    }

    setJoining(true);

    // External meeting
    if (meeting.meeting_url) {
      window.open(
        meeting.meeting_url,
        "_blank",
        "noopener,noreferrer"
      );

      setJoining(false);
      return;
    }

    // Internal AI interview
    const candidateId =
      meeting.employee_request_id ||
      meeting.employee_email;

    navigate(
      `/interview?id=${encodeURIComponent(candidateId)}`,
      {
        state: {
          meetingId: meeting.id,
          employeeEmail: meeting.employee_email,
          employeeName:
            meeting.employee_name || "Employee",
          meetingTitle:
            meeting.title || "AI Interview",
        },
      }
    );

    setJoining(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.06]">
            <Video
              size={24}
              className="text-blue-300"
            />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Loading meeting...
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Please wait while we prepare the interview room.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-400/10 bg-white/[0.025] p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/[0.07] text-red-300">
            <Video size={24} />
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Unable to open meeting
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/meetings")}
            className="mt-7 w-full rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
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

  const hasExternalMeeting =
    Boolean(meeting.meeting_url);

  const status =
    meeting.status || "scheduled";

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#090b0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400">
              Interview Room
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              {meeting.title || "AI Interview"}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/meetings")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-white/60 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.02] shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Details */}
            <div className="p-8 sm:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400">
                Scheduled Interview
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {meeting.title || "AI Interview"}
              </h2>

              <div className="mt-10 space-y-6">
                <InfoRow
                  icon={User}
                  label="Employee"
                  value={
                    meeting.employee_name ||
                    "Employee"
                  }
                  secondary={
                    meeting.employee_email
                  }
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Scheduled time"
                  value={
                    meeting.scheduled_at
                      ? new Date(
                          meeting.scheduled_at
                        ).toLocaleString()
                      : "Not scheduled"
                  }
                />

                <InfoRow
                  icon={Clock3}
                  label="Duration"
                  value={`${meeting.duration_minutes || 30} minutes`}
                />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Status
                  </p>

                  <span className="mt-2 inline-flex rounded-full border border-blue-400/15 bg-blue-400/[0.06] px-3 py-1.5 text-xs font-semibold capitalize text-blue-300">
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Join */}
            <div className="flex items-center border-t border-white/[0.06] bg-white/[0.015] p-8 lg:border-l lg:border-t-0 sm:p-10">
              <div className="w-full rounded-3xl border border-white/[0.07] bg-black/20 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/[0.07]">
                  {hasExternalMeeting ? (
                    <ExternalLink
                      size={27}
                      className="text-blue-300"
                    />
                  ) : (
                    <Video
                      size={27}
                      className="text-blue-300"
                    />
                  )}
                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  Ready to join?
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/35">
                  {hasExternalMeeting
                    ? "Open the scheduled meeting in a new tab."
                    : "Start your adaptive AI technical interview."}
                </p>

                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={joining}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {joining
                    ? "Opening..."
                    : hasExternalMeeting
                    ? "Join Meeting"
                    : "Start AI Interview"}

                  {hasExternalMeeting && (
                    <ExternalLink size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  secondary,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.05]">
        <Icon
          size={17}
          className="text-blue-300/80"
        />
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
          {label}
        </p>

        <p className="mt-1 text-sm text-white/75">
          {value}
        </p>

        {secondary && (
          <p className="mt-1 text-xs text-white/30">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}