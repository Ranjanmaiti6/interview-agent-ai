export default function InterviewHeader({
  questionNumber,
  totalQuestions,
  candidateName = "Riya Sharma",
  topic = "RAG",
  difficulty = "Medium",
}) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-white">
          AI Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Candidate: {candidateName}
        </p>

        <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-300">

          <div>
            <span className="font-semibold">Question:</span>{" "}
            {questionNumber} / {totalQuestions}
          </div>

          <div>
            <span className="font-semibold">Topic:</span>{" "}
            {topic}
          </div>

          <div>
            <span className="font-semibold">Difficulty:</span>{" "}
            {difficulty}
          </div>

        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full mt-5">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      </div>

    </div>
  );
}