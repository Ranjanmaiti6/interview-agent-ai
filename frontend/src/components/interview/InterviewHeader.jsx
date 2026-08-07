export default function InterviewHeader({
  questionNumber = 1,
  totalQuestions = 8,
}) {
  const progress =
    (questionNumber / totalQuestions) * 100;

  return (
    <div className="border-b border-slate-800 p-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-white text-3xl font-bold">
          AI Technical Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Question {questionNumber} of {totalQuestions}
          {" "}• AI Engineering Track
        </p>


        <div className="bg-slate-800 h-2 rounded-full mt-5">

          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width:`${progress}%`
            }}
          />

        </div>

      </div>

    </div>
  );
}