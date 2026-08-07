import { useState } from "react";


export default function InterviewInput({
  onSend
}) {

  const [answer,setAnswer] = useState("");


  const handleSend = () => {

    if(!answer.trim()) return;

    onSend(answer);

    setAnswer("");

  };


  return (

    <div className="
      border-t
      border-slate-800
      p-5
    ">

      <div className="
        max-w-4xl
        mx-auto
        flex
        gap-4
      ">


        <input

          value={answer}

          onChange={(e)=>setAnswer(e.target.value)}

          placeholder="Explain your answer..."

          className="
          flex-1
          bg-slate-900
          border
          border-slate-700
          rounded-xl
          px-5
          py-3
          text-white
          "

        />


        <button

          onClick={handleSend}

          className="
          bg-blue-600
          px-6
          rounded-xl
          text-white
          font-semibold
          "

        >
          Send
        </button>


      </div>

    </div>

  );
}