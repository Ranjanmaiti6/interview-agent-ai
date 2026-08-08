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

  const [resume, setResume] =
    useState(null);


  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login?role=employee");
  };


  // ==========================================
  // Select Resume
  // ==========================================

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setResume(null);

      setRequestStatus(
        "Please upload a PDF, DOC, or DOCX resume."
      );

      event.target.value = "";

      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setResume(null);

      setRequestStatus(
        "Resume must be smaller than 5 MB."
      );

      event.target.value = "";

      return;
    }

    setResume(file);

    setRequestStatus("");
  };


  // ==========================================
  // Submit Interview Request
  // ==========================================

  const submitInterviewRequest = async () => {

    if (!resume) {
      setRequestStatus(
        "Please upload your resume before submitting the request."
      );

      return;
    }

    setLoading(true);
    setRequestStatus("");


    try {
      const token =
        localStorage.getItem("token");


      // ========================================
      // Create multipart form data
      // ========================================

      const formData = new FormData();

      formData.append(
        "name",
        user.name || "Employee"
      );

      formData.append(
        "email",
        user.email || ""
      );

      formData.append(
        "resume",
        resume
      );


      // ========================================
      // Send request
      // ========================================

      const response = await fetch(
        `${API_URL}/api/employee/request`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
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
        "Request submitted successfully. The admin will review your resume and request."
      );

      setResume(null);


      // Reset file input
      const fileInput =
        document.getElementById(
          "resume-upload"
        );

      if (fileInput) {
        fileInput.value = "";
      }

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

          <p className="text-blue-400 text-sm font-semibold uppercase">
            Interview Request
          </p>

          <h3 className="text-2xl font-bold mt-2">
            Request an Interview
          </h3>

          <p className="text-slate-400 mt-2 max-w-2xl">
            Submit your resume and request an
            interview. The admin will review your
            profile and resume before scheduling
            the interview.
          </p>


          {/* ================================= */}
          {/* Resume Upload */}
          {/* ================================= */}

          <div className="mt-8">

            <label
              htmlFor="resume-upload"
              className="block text-sm font-semibold text-slate-300 mb-3"
            >
              Upload Resume
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="block w-full text-sm text-slate-400
                file:mr-4
                file:py-3
                file:px-5
                file:rounded-xl
                file:border-0
                file:bg-blue-600
                file:text-white
                file:font-semibold
                hover:file:bg-blue-700
                file:cursor-pointer
                bg-slate-800
                border border-slate-700
                rounded-xl"
            />

            <p className="text-slate-500 text-sm mt-2">
              Accepted formats: PDF, DOC, DOCX.
              Maximum size: 5 MB.
            </p>


            {/* Selected file */}

            {resume && (
              <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4">

                <p className="text-green-400 font-semibold">
                  Resume selected
                </p>

                <p className="text-slate-300 text-sm mt-1">
                  {resume.name}
                </p>

              </div>
            )}

          </div>


          {/* ================================= */}
          {/* Submit */}
          {/* ================================= */}

          <div className="mt-8 flex justify-end">

            <button
              onClick={
                submitInterviewRequest
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold"
            >

              {loading
                ? "Submitting..."
                : "Request Interview"}

            </button>

          </div>


          {/* ================================= */}
          {/* Request message */}
          {/* ================================= */}

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
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition"
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