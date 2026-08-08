import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

import ScoreCard from "../../components/report/ScoreCard";
import Recommendation from "../../components/report/Recommendation";

export default function Report() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const score = state?.score || {
    technical: 0,
    communication: 0,
    problemSolving: 0,
  };

  const candidateName =
    state?.candidateName || "Candidate";

  const strengths =
    state?.strengths?.length > 0
      ? state.strengths
      : ["No strengths recorded yet"];

  const gaps =
    state?.gaps?.length > 0
      ? state.gaps
      : ["No knowledge gaps recorded yet"];

  const overall = Math.round(
    (
      score.technical +
      score.communication +
      score.problemSolving
    ) / 3
  );

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Back button */}

        <button
          onClick={() => navigate("/candidate")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-10"
        >
          <ArrowLeft size={18} />
          Back to Candidates
        </button>


        {/* Header */}

        <div>

          <p className="text-blue-400 uppercase tracking-[0.3em] font-semibold">
            AI Interview
          </p>

          <h1 className="text-5xl font-black text-white mt-3">
            Interview Report
          </h1>

          <p className="text-slate-400 text-lg mt-3">
            Candidate:{" "}
            <span className="text-white font-semibold">
              {candidateName}
            </span>
          </p>

        </div>


        {/* Overall Score */}

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-slate-400">
                Overall Interview Score
              </p>

              <h2 className="text-6xl font-black text-white mt-2">
                {overall}%
              </h2>

            </div>

            <div className="text-right">

              <p className="text-slate-500">
                Interview Status
              </p>

              <p className="text-green-400 font-bold mt-2">
                ✓ Completed Successfully
              </p>

            </div>

          </div>

        </div>


        {/* Score Cards */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <ScoreCard
            title="Technical"
            value={score.technical}
          />

          <ScoreCard
            title="Communication"
            value={score.communication}
          />

          <ScoreCard
            title="Problem Solving"
            value={score.problemSolving}
          />

        </div>


        {/* Strengths + Gaps */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">


          {/* Strengths */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="flex items-center gap-3">

              <CheckCircle
                className="text-green-500"
                size={28}
              />

              <h2 className="text-2xl font-bold text-white">
                Strengths
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {strengths.map((strength, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800 rounded-xl p-4"
                >

                  <CheckCircle
                    className="text-green-500"
                    size={20}
                  />

                  <p className="text-slate-300">
                    {strength}
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* Knowledge Gaps */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="flex items-center gap-3">

              <AlertTriangle
                className="text-yellow-500"
                size={28}
              />

              <h2 className="text-2xl font-bold text-white">
                Knowledge Gaps
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {gaps.map((gap, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800 rounded-xl p-4"
                >

                  <AlertTriangle
                    className="text-yellow-500"
                    size={20}
                  />

                  <p className="text-slate-300">
                    {gap}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* Recommendation */}

        <Recommendation
          overall={overall}
          candidateName={candidateName}
          recommendation={
            state?.recommendation
          }
        />


        {/* Finish */}

        <div className="text-center mt-12">

          <button
            onClick={() => navigate("/candidate")}
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-white font-semibold"
          >
            Interview Another Candidate
          </button>

        </div>

      </div>

    </div>
  );
}