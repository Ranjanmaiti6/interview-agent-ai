import { useNavigate } from "react-router-dom";


export default function CandidateCard({ candidate }) {

  const navigate = useNavigate();

  const progress =
    (candidate.completedDays / candidate.totalDays) * 100;


  return (
    <div className="
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-6
      hover:border-blue-500
      transition
    ">


      <h2 className="text-white text-2xl font-bold">
        {candidate.name}
      </h2>


      <p className="text-blue-400 mt-2">
        {candidate.role}
      </p>


      <p className="text-slate-400 mt-4">
        Level: {candidate.level}
      </p>


      <div className="mt-6">

        <div className="flex justify-between text-sm text-slate-400">
          <span>
            Cohort Progress
          </span>

          <span>
            {candidate.completedDays}/{candidate.totalDays}
          </span>

        </div>


        <div className="bg-slate-800 h-2 rounded-full mt-2">

          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{
              width:`${progress}%`
            }}
          />

        </div>

      </div>


      <div className="flex flex-wrap gap-2 mt-6">

        {
          candidate.skills.map(skill=>(
            <span
              key={skill}
              className="
              bg-slate-800
              text-white
              px-3
              py-1
              rounded-full
              text-sm
              "
            >
              {skill}
            </span>
          ))
        }

      </div>


      <button
        onClick={() => navigate("/interview")}
        className="
        mt-8
        w-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-3
        rounded-xl
        font-semibold
        "
      >
        Start Interview
      </button>


    </div>
  );
}