export default function ChatMessage({
  role,
  text
}) {

  return (

    <div
      className={
        role === "ai"
        ? "flex justify-start"
        : "flex justify-end"
      }
    >

      <div
        className={`
          max-w-xl
          p-5
          rounded-2xl
          ${
            role==="ai"
            ?
            "bg-slate-800 text-white"
            :
            "bg-blue-600 text-white"
          }
        `}
      >

        <p className="text-sm opacity-70 mb-2">
          {role==="ai" ? "AI Interviewer" : "You"}
        </p>


        <p>
          {text}
        </p>


      </div>

    </div>

  );
}