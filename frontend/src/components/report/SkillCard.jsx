import { CheckCircle, AlertTriangle } from "lucide-react";

export default function SkillCard({ title, skills }) {
  const isStrength = title === "Strengths";

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

      <h2 className="text-white text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="space-y-4">

        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-4"
          >
            {isStrength ? (
              <CheckCircle className="text-green-500" size={22} />
            ) : (
              <AlertTriangle className="text-yellow-500" size={22} />
            )}

            <span className="text-slate-300 text-lg">
              {skill}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}