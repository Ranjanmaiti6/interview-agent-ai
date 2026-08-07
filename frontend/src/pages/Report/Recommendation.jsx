export default function Recommendation({
  overall,
  candidateName,
}) {
  let recommendation = "";
  let color = "";

  if (overall >= 85) {
    recommendation =
      "Excellent performance. Recommended for an AI Engineering Internship.";

    color = "from-green-600 to-emerald-500";
  } else if (overall >= 70) {
    recommendation =
      "Good performance. Strong fundamentals with room for improvement.";

    color = "from-blue-600 to-cyan-500";
  } else {
    recommendation =
      "Needs more practice before attempting technical interviews.";

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

      <p className="text-white mt-8 leading-8 text-lg">
        {recommendation}
      </p>
    </div>
  );
}