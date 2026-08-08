import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Video,
  Calendar,
  Clock,
  Users,
} from "lucide-react";

export default function Meetings() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);

  // ==========================================
  // Load meetings
  // ==========================================

  useEffect(() => {
    const savedMeetings = JSON.parse(
      localStorage.getItem("meetings") || "[]"
    );

    setMeetings(savedMeetings);
  }, []);


  // ==========================================
  // Get meeting status
  // ==========================================

  const getMeetingStatus = (meeting) => {
    // If meeting was completed
    if (meeting.status === "completed") {
      return "Completed";
    }

    // If meeting is currently active
    if (meeting.status === "in-progress") {
      return "In Progress";
    }

    // If someone has joined
    if (meeting.status === "waiting") {
      return "Waiting";
    }

    // Default
    return "Scheduled";
  };


  // ==========================================
  // Status styling
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-400";

      case "In Progress":
        return "bg-blue-500/10 text-blue-400";

      case "Waiting":
        return "bg-yellow-500/10 text-yellow-400";

      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ==================================
            Header
        ================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>

            <p className="text-purple-400 uppercase tracking-[0.25em] text-sm font-semibold">
              Meetings
            </p>

            <h1 className="text-4xl font-black mt-2">
              Meetings
            </h1>

            <p className="text-slate-400 mt-2">
              Manage client and employee meetings.
            </p>

          </div>


          {/* Create Meeting */}

          <button
            onClick={() =>
              navigate("/meetings/create")
            }
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold"
          >
            <Plus size={20} />
            Create Meeting
          </button>

        </div>


        {/* ==================================
            No Meetings
        ================================== */}

        {meetings.length === 0 ? (

          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

            <Video
              size={52}
              className="mx-auto text-purple-500"
            />

            <h2 className="text-2xl font-bold mt-5">
              No meetings yet
            </h2>

            <p className="text-slate-400 mt-3">
              Create your first client or employee meeting.
            </p>

            <button
              onClick={() =>
                navigate("/meetings/create")
              }
              className="mt-7 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
            >
              Create Your First Meeting
            </button>

          </div>

        ) : (

          /* ==================================
             Meeting Cards
          ================================== */

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {meetings.map((meeting) => {

              const status =
                getMeetingStatus(meeting);

              return (

                <div
                  key={meeting.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >

                  {/* Meeting Type */}

                  <div className="flex items-center justify-between">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        meeting.type === "client"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {meeting.type === "client"
                        ? "Client Meeting"
                        : "Employee Meeting"}
                    </span>

                    <Video
                      size={22}
                      className="text-purple-400"
                    />

                  </div>


                  {/* Title */}

                  <h2 className="text-2xl font-bold mt-5">
                    {meeting.title}
                  </h2>


                  {/* Participant */}

                  <div className="flex items-center gap-3 text-slate-300 mt-5">

                    <Users size={18} />

                    <span>
                      {meeting.participant}
                    </span>

                  </div>


                  {/* Date */}

                  <div className="flex items-center gap-3 text-slate-400 mt-4">

                    <Calendar size={18} />

                    <span>
                      {meeting.date}
                    </span>

                  </div>


                  {/* Time */}

                  <div className="flex items-center gap-3 text-slate-400 mt-3">

                    <Clock size={18} />

                    <span>
                      {meeting.time} ·{" "}
                      {meeting.duration} minutes
                    </span>

                  </div>


                  {/* Dynamic Status */}

                  <div className="flex items-center gap-3 mt-4">

                    <span className="text-sm text-slate-400">
                      Status:
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                        status
                      )}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* Join Button */}

                  <button
                    onClick={() =>
                      navigate(
                        `/meetings/${meeting.id}`
                      )
                    }
                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >

                    <Video size={19} />

                    {status === "In Progress"
                      ? "Join Meeting"
                      : status === "Completed"
                      ? "View Meeting"
                      : "Join Meeting"}

                  </button>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}