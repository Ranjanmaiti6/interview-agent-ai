const candidates = [
  {
    id: 1,
    name: "Riya Sharma",
    skills: "RAG, Prompt Engineering",
    progress: "Completed 10/31 days"
  },
  {
    id: 2,
    name: "Arjun Patel",
    skills: "AI Agents, Deployment",
    progress: "Completed 20/31 days"
  }
];


export default function Candidate() {


  const startInterview = (id) => {

    window.location.href = `/interview?id=${id}`;

  };


  return (

    <div className="
      min-h-screen
      bg-slate-950
      p-10
    ">


      <h1 className="
        text-white
        text-4xl
        font-bold
        mb-10
      ">
        Select Candidate
      </h1>



      <div className="
        grid
        md:grid-cols-2
        gap-8
      ">


        {
          candidates.map((candidate)=>(


            <div
              key={candidate.id}
              className="
              bg-slate-900
              rounded-2xl
              p-6
              "
            >


              <h2 className="
                text-white
                text-2xl
                font-bold
              ">
                {candidate.name}
              </h2>



              <p className="
                text-slate-400
                mt-3
              ">
                {candidate.skills}
              </p>


              <p className="
                text-slate-500
                mt-2
              ">
                {candidate.progress}
              </p>



              <button

                onClick={() =>
                  startInterview(candidate.id)
                }

                className="
                mt-6
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-xl
                "

              >

                Start Interview

              </button>



            </div>


          ))
        }


      </div>


    </div>

  );

}