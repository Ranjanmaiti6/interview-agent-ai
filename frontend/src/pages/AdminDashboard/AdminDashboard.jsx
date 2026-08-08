import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

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
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </header>


      <main className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-4xl font-black">
          Welcome, {user.name || "Admin"}
        </h2>

        <p className="text-slate-400 mt-2">
          Manage employees, interviews and meetings.
        </p>


        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <button
            onClick={() =>
              navigate("/admin/requests")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500"
          >
            <h3 className="text-xl font-bold">
              Interview Requests
            </h3>

            <p className="text-slate-400 mt-2">
              Review employee requests and resumes.
            </p>
          </button>


          <button
            onClick={() =>
              navigate("/admin/meetings")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500"
          >
            <h3 className="text-xl font-bold">
              Meetings
            </h3>

            <p className="text-slate-400 mt-2">
              Schedule and conduct employee interviews.
            </p>
          </button>


          <button
            onClick={() =>
              navigate("/admin/reports")
            }
            className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500"
          >
            <h3 className="text-xl font-bold">
              AI Reports
            </h3>

            <p className="text-slate-400 mt-2">
              Review AI interview scores and reports.
            </p>
          </button>

        </div>

      </main>

    </div>
  );
}