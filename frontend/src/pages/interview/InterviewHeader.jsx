export default function InterviewHeader({
  questionNumber,
  totalQuestions,
  candidateName,
  topic,
  difficulty,
}) {

  const progress =
    (questionNumber / totalQuestions) * 100;

  return (

    <div className="bg-slate-900 border-b border-slate-800">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-black text-white">
          AI Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Candidate: {candidateName}
        </p>

        <div className="grid md:grid-cols-4 gap-6 mt-8">

          <div>

            <p className="text-slate-500">
              Question
            </p>

            <h3 className="text-white text-xl font-bold">
              {questionNumber} / {totalQuestions}
            </h3>

          </div>

          <div>

            <p className="text-slate-500">
              Topic
            </p>

            <h3 className="text-white text-xl font-bold">
              {topic}
            </h3>

          </div>

          <div>

            <p className="text-slate-500">
              Difficulty
            </p>

            <h3 className="text-white text-xl font-bold">
              {difficulty}
            </h3>

          </div>

          <div>

            <p className="text-slate-500">
              Remaining
            </p>

            <h3 className="text-white text-xl font-bold">
              {totalQuestions - questionNumber}
            </h3>

          </div>

        </div>

        <div className="mt-8">

          <div className="w-full bg-slate-800 rounded-full h-3">

            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

        </div>

      </div>

    </div>

  );

}
