import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, Video } from "lucide-react";

export default function CreateMeeting() {
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState("client");
  const [title, setTitle] = useState("");
  const [participant, setParticipant] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");

  const handleSubmit = (event) => {
    event.preventDefault();

    const meeting = {
      id: Date.now(),
      type: meetingType,
      title,
      participant,
      date,
      time,
      duration,
    };

    // Temporary storage.
    // Later we will replace this with the backend API.
    const existingMeetings = JSON.parse(
      localStorage.getItem("meetings") || "[]"
    );

    localStorage.setItem(
      "meetings",
      JSON.stringify([...existingMeetings, meeting])
    );

    navigate("/meetings");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-3xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate("/meetings")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          Back to Meetings
        </button>

        <p className="text-purple-400 uppercase tracking-[0.25em] text-sm font-semibold">
          Meetings
        </p>

        <h1 className="text-4xl font-black mt-2">
          Create Meeting
        </h1>

        <p className="text-slate-400 mt-3">
          Schedule a client or employee meeting.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8"
        >

          {/* Meeting Type */}

          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Meeting Type
          </label>

          <div className="grid md:grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() => setMeetingType("client")}
              className={`p-5 rounded-xl border text-left ${
                meetingType === "client"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              <Users className="text-blue-400 mb-3" />

              <p className="font-bold">
                Client Meeting
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Meeting with a client.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMeetingType("employee")}
              className={`p-5 rounded-xl border text-left ${
                meetingType === "employee"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              <Users className="text-green-400 mb-3" />

              <p className="font-bold">
                Employee Meeting
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Meeting with an employee.
              </p>
            </button>

          </div>


          {/* Title */}

          <div className="mt-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Meeting Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Discussion"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Participant */}

          <div className="mt-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {meetingType === "client"
                ? "Client Name"
                : "Employee Name"}
            </label>

            <input
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              placeholder={
                meetingType === "client"
                  ? "Client name"
                  : "Employee name"
              }
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Date and Time */}

          <div className="grid md:grid-cols-2 gap-5 mt-6">

            <div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Date
              </label>

              <div className="relative">

                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>


            <div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Time
              </label>

              <div className="relative">

                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>

          </div>


          {/* Duration */}

          <div className="mt-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Duration
            </label>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>

          </div>


          <button
            type="submit"
            className="w-full mt-8 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold"
          >
            <Video size={20} />
            Create Meeting
          </button>

        </form>

      </div>

    </div>
  );
}