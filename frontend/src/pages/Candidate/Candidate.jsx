import { useNavigate } from "react-router-dom";

const candidates = [
  {
    id: 1,
    name: "Riya Sharma",
    skills: "RAG, Prompt Engineering",
    progress: "Completed 10/31 Days"
  },
  {
    id: 2,
    name: "Arjun Patel",
    skills: "AI Agents, Deployment",
    progress: "Completed 20/31 Days"
  }
];

export default function Candidate() {

  const navigate = useNavigate();

  const startInterview = (id) => {
    navigate(`/candidate/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-10">

      <h1 className="text-white text-5xl font-black mb-10">
        Select Candidate
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {candidates.map((candidate) => (

          <div
            key={candidate.id}
            className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 transition"
          >

            <h2 className="text-white text-3xl font-bold">
              {candidate.name}
            </h2>

            <p className="text-slate-400 mt-4">
              {candidate.skills}
            </p>

            <p className="text-slate-500 mt-2">
              {candidate.progress}
            </p>

            <button
              onClick={() => startInterview(candidate.id)}
              className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-white font-semibold"
            >
              View Dashboard
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}