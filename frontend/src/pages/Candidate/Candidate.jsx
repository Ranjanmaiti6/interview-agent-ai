import CandidateCard from "../../components/candidate/CandidateCard";
import candidates from "../../data/candidates";


export default function Candidate(){

  return (

    <div className="min-h-screen bg-slate-950 p-8">

      <div className="max-w-7xl mx-auto">


        <h1 className="
          text-5xl
          font-black
          text-white
        ">
          Choose Candidate
        </h1>


        <p className="text-slate-400 mt-4">
          Select a candidate profile to begin an adaptive AI interview.
        </p>



        <div className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
          mt-12
        ">

          {
            candidates.map(candidate=>(
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
              />
            ))
          }


        </div>


      </div>

    </div>

  );
}