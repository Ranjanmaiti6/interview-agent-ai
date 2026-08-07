export default function Recommendation({
  overall,
  candidateName,
  recommendation,
}) {
  let color = "";

  if (overall >= 85) {
    color = "from-green-600 to-emerald-500";
  } else if (overall >= 70) {
    color = "from-blue-600 to-cyan-500";
  } else {
    color = "from-red-600 to-orange-500";
  }

  return (
    <div
      className={`bg-gradient-to-r ${color} rounded-2xl p-10 mt-12`}
    >
      <h2 className="text-3xl font-black text-white">
        AI Recommendation
      </h2>

      <p className="text-white/90 text-lg mt-6">
        Candidate:
        <span className="font-bold">
          {" "}
          {candidateName}
        </span>
      </p>

      <p className="text-white/90 text-lg mt-3">
        Overall Score:
        <span className="font-bold">
          {" "}
          {overall}%
        </span>
      </p>

      <div className="mt-8 bg-white/10 rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-3">
          AI Analysis
        </h3>

        <p className="text-white leading-8 text-lg">
          {recommendation ||
            "No recommendation available."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">

        <div className="bg-white/10 rounded-xl p-5">
          <h4 className="text-white font-bold">
            Technical
          </h4>
          <p className="text-white/80 mt-2">
            Evaluated using technical answers and
            problem-solving approach.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-5">
          <h4 className="text-white font-bold">
            Communication
          </h4>
          <p className="text-white/80 mt-2">
            Measured by clarity, explanation quality,
            and confidence.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-5">
          <h4 className="text-white font-bold">
            Improvement
          </h4>
          <p className="text-white/80 mt-2">
            Continue practicing weak topics and build
            real-world AI projects.
          </p>
        </div>

      </div>
    </div>
  );
}