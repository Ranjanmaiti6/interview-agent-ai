import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";


export default function AdminDashboard() {

  const navigate = useNavigate();


  // ==========================================
  // Current user
  // ==========================================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  // ==========================================
  // State
  // ==========================================

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);


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


      if (!token) {

        navigate("/login?role=admin");

        return;

      }


      console.log(
        "Loading employee requests from:",
        `${API_URL}/api/employee/requests`
      );


      const response =
        await fetch(
          `${API_URL}/api/employee/requests`,
          {
            method: "GET",

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
          "Unable to load employee requests."
        );

      }


      setRequests(
        Array.isArray(data.requests)
          ? data.requests
          : []
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


  // ==========================================
  // Load requests on page load
  // ==========================================

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

      setUpdatingId(requestId);

      setError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/login?role=admin");

        return;

      }


      const response =
        await fetch(
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


      // Reload requests after update

      await loadRequests();

    } catch (error) {

      console.error(
        "Update request error:",
        error
      );


      setError(
        error.message ||
        "Unable to update employee request."
      );

    } finally {

      setUpdatingId(null);

    }

  };


  // ==========================================
  // Resume URL
  // ==========================================

  const getResumeUrl = (request) => {

    if (!request?.resume) {
      return null;
    }


    // New backend format

    if (request.resume.url) {
      return request.resume.url;
    }


    // Existing backend format

    if (request.resume.path) {

      if (
        request.resume.path.startsWith(
          "http://"
        ) ||
        request.resume.path.startsWith(
          "https://"
        )
      ) {

        return request.resume.path;

      }


      return `${API_URL}${request.resume.path}`;

    }


    return null;

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
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================================= */}
      {/* Main */}
      {/* ================================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">


        {/* ================================= */}
        {/* Welcome */}
        {/* ================================= */}

        <div>

          <h2 className="text-4xl font-black">
            Welcome, {user.name || "Admin"}
          </h2>

          <p className="text-slate-400 mt-2">
            Manage employees, interviews and meetings.
          </p>

        </div>


        {/* ================================= */}
        {/* Dashboard Cards */}
        {/* ================================= */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">


          {/* Interview Requests */}

          <button
            type="button"
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


          {/* Meetings */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin/meetings")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 transition"
          >

            <h3 className="text-xl font-bold">
              Meetings
            </h3>

            <p className="text-slate-400 mt-2">
              Schedule and conduct employee
              interviews.
            </p>

          </button>


          {/* AI Reports */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin/reports")
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


          {/* ================================= */}
          {/* Section Header */}
          {/* ================================= */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>

              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
                Employee Requests
              </p>

              <h2 className="text-3xl font-bold mt-1">
                Interview Requests
              </h2>

            </div>


            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="border border-slate-700 hover:bg-slate-800 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition"
            >
              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>


          {/* ================================= */}
          {/* Error */}
          {/* ================================= */}

          {error && (

            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">

              <p className="font-semibold">
                Error
              </p>

              <p className="mt-1">
                {error}
              </p>

            </div>

          )}


          {/* ================================= */}
          {/* Loading */}
          {/* ================================= */}

          {loading && (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

              <div className="animate-pulse">

                <p className="text-slate-400">
                  Loading employee requests...
                </p>

              </div>

            </div>

          )}


          {/* ================================= */}
          {/* No Requests */}
          {/* ================================= */}

          {!loading &&
            !error &&
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


          {/* ================================= */}
          {/* Requests */}
          {/* ================================= */}

          {!loading &&
            requests.length > 0 && (

              <div className="space-y-4">

                {requests.map(
                  (request) => {

                    const resumeUrl =
                      getResumeUrl(request);


                    return (

                      <div
                        key={request.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                      >


                        {/* ================================= */}
                        {/* Request Information */}
                        {/* ================================= */}

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


                          {/* Employee */}

                          <div className="min-w-0">

                            <h3 className="text-xl font-bold break-words">
                              {request.name ||
                                "Unknown Employee"}
                            </h3>

                            <p className="text-slate-400 mt-1 break-words">
                              {request.email ||
                                "No email"}
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

                            <p className="text-slate-500 text-sm mb-1">
                              Status
                            </p>

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

                          {request.status ===
                            "pending" && (

                            <div className="flex gap-3">

                              <button
                                type="button"
                                disabled={
                                  updatingId ===
                                  request.id
                                }
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    "accepted"
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold transition"
                              >

                                {updatingId ===
                                request.id
                                  ? "Updating..."
                                  : "Accept"}

                              </button>


                              <button
                                type="button"
                                disabled={
                                  updatingId ===
                                  request.id
                                }
                                onClick={() =>
                                  updateRequestStatus(
                                    request.id,
                                    "rejected"
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold transition"
                              >
                                Reject
                              </button>

                            </div>

                          )}

                        </div>


                        {/* ================================= */}
                        {/* Resume */}
                        {/* ================================= */}

                        <div className="mt-5 pt-5 border-t border-slate-800">

                          <p className="text-sm text-slate-500">
                            Resume
                          </p>


                          {resumeUrl ? (

                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 mt-2 inline-block font-semibold"
                            >
                              View Resume
                            </a>

                          ) : (

                            <p className="text-slate-500 mt-2">
                              No resume uploaded yet.
                            </p>

                          )}

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}