import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [requestStatus, setRequestStatus] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login?role=employee");
  };

  const submitInterviewRequest = async () => {
    setLoading(true);
    setRequestStatus("");

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/employee/request`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: user.name || "Employee",
            email: user.email || "",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit request."
        );
      }

      setRequestStatus(
        "Request submitted successfully. The admin will review it."
      );

    } catch (error) {
      console.error(
        "Request error:",
        error
      );

      setRequestStatus(
        error.message ||
          "Unable to submit request."
      );
    } finally {
      setLoading(false);
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
            <p className="text-blue-400 text-sm font-semibold">
              EMPLOYEE
            </p>

            <h1 className="text-2xl font-bold">
              Employee Dashboard
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
          Welcome, {user.name || "Employee"}
        </h2>

        <p className="text-slate-400 mt-2">
          Complete your AI interview and manage
          your interviews.
        </p>


        {/* ================================= */}
        {/* Interview Request */}
        {/* ================================= */}

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-blue-400 text-sm font-semibold uppercase">
                Interview Request
              </p>

              <h3 className="text-2xl font-bold mt-2">
                Request an Interview
              </h3>

              <p className="text-slate-400 mt-2 max-w-2xl">
                Submit a request to the admin to begin
                the interview process. The admin can
                review your profile and schedule your
                interview.
              </p>

            </div>


            <button
              onClick={
                submitInterviewRequest
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold whitespace-nowrap"
            >
              {loading
                ? "Submitting..."
                : "Request Interview"}
            </button>

          </div>


          {/* Request message */}

          {requestStatus && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl p-4">
              {requestStatus}
            </div>
          )}

        </div>


        {/* ================================= */}
        {/* Dashboard Cards */}
        {/* ================================= */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          {/* AI Interview */}

          <button
            onClick={() =>
              navigate("/interview")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >

            <h3 className="text-xl font-bold">
              AI Interview
            </h3>

            <p className="text-slate-400 mt-2">
              Complete your adaptive AI interview.
            </p>

          </button>


          {/* Meetings */}

          <button
            onClick={() =>
              navigate("/meetings")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >

            <h3 className="text-xl font-bold">
              My Meetings
            </h3>

            <p className="text-slate-400 mt-2">
              View and join scheduled interviews.
            </p>

          </button>


          {/* Results */}

          <button
            onClick={() =>
              navigate("/report")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >

            <h3 className="text-xl font-bold">
              My Results
            </h3>

            <p className="text-slate-400 mt-2">
              View your AI interview results.
            </p>

          </button>

        </div>

      </main>

    </div>
  );
}