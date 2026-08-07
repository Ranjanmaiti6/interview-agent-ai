import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Brain, BookOpen, Trophy } from "lucide-react";

const candidates = {
  1: {
    id: 1,
    name: "Riya Sharma",
    progress: 10,
    total: 31,
    strengths: ["Prompt Engineering", "RAG", "Vector Databases"],
    weaknesses: ["Deployment", "MCP"],
  },
  2: {
    id: 2,
    name: "Arjun Patel",
    progress: 20,
    total: 31,
    strengths: ["AI Agents", "Deployment", "System Design"],
    weaknesses: ["Evaluation"],
  },
};

export default function CandidateDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const candidate = candidates[id];

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Candidate not found
      </div>
    );
  }

  const progress = (candidate.progress / candidate.total) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-black">
          Candidate Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Review learning progress before starting the interview.
        </p>

        {/* Candidate Card */}
        <div className="bg-slate-900 rounded-2xl p-8 mt-10">

          <h2 className="text-3xl font-bold">
            {candidate.name}
          </h2>

          <p className="text-slate-400 mt-3">
            Progress: {candidate.progress} / {candidate.total} Days
          </p>

          <div className="w-full bg-slate-800 rounded-full h-3 mt-5">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* Info Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mt-10">

          <div className="bg-slate-900 rounded-2xl p-6">
            <Brain className="text-blue-500 mb-4" size={36} />
            <h3 className="text-xl font-bold">Strengths</h3>

            <ul className="mt-4 space-y-2 text-slate-300">
              {candidate.strengths.map((item) => (
                <li key={item}>✅ {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <BookOpen className="text-yellow-500 mb-4" size={36} />
            <h3 className="text-xl font-bold">
              Needs Improvement
            </h3>

            <ul className="mt-4 space-y-2 text-slate-300">
              {candidate.weaknesses.map((item) => (
                <li key={item}>⚠️ {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <Trophy className="text-green-500 mb-4" size={36} />

            <h3 className="text-xl font-bold">
              Interview
            </h3>

            <p className="text-slate-400 mt-4">
              • 8 Adaptive Questions
            </p>

            <p className="text-slate-400">
              • AI Follow-up Questions
            </p>

            <p className="text-slate-400">
              • Personalized Report
            </p>

            <button
              onClick={() =>
                navigate(`/interview?id=${candidate.id}`)
              }
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
            >
              Start Interview
              <ArrowRight size={20} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}