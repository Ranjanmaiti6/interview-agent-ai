import ScoreCard from "../../components/report/ScoreCard";
import SkillCard from "../../components/report/SkillCard";
import Recommendation from "../../components/report/Recommendation";

export default function Report() {

  const report = {
    overall: 84,
    technical: 88,
    communication: 80,
    problemSolving: 85,

    strengths: [
      "Retrieval Augmented Generation",
      "Prompt Engineering",
      "Vector Databases"
    ],

    gaps: [
      "Model Context Protocol",
      "Production Deployment",
      "LLM Evaluation"
    ]
  };

  return (

    <div className="min-h-screen bg-slate-950">

      <div className="max-w-7xl mx-auto py-16 px-6">

        <h1 className="text-5xl font-black text-white">
          Interview Report
        </h1>

        <p className="text-slate-400 mt-3">
          Personalized AI Interview Analysis
        </p>

        <div className="grid lg:grid-cols-4 gap-6 mt-12">

          <ScoreCard
            title="Overall Score"
            value={report.overall}
          />

          <ScoreCard
            title="Technical"
            value={report.technical}
          />

          <ScoreCard
            title="Communication"
            value={report.communication}
          />

          <ScoreCard
            title="Problem Solving"
            value={report.problemSolving}
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <SkillCard
            title="Strengths"
            skills={report.strengths}
          />

          <SkillCard
            title="Knowledge Gaps"
            skills={report.gaps}
          />

        </div>

        <Recommendation />

      </div>

    </div>

  );

}