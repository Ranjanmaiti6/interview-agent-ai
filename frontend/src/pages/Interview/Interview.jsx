import ChatMessage from "../../components/interview/ChatMessage";
import InterviewInput from "../../components/interview/InterviewInput";

export default function Interview() {

  const messages = [
    {
      role: "ai",
      text: "Hello! I will be conducting your AI engineering interview today. Let's start with your experience with RAG systems."
    },
    {
      role: "user",
      text: "I have built a RAG application using vector databases."
    }
  ];


  return (

    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* Header */}
      <div className="
        border-b
        border-slate-800
        p-6
      ">
        <h1 className="
          text-white
          text-3xl
          font-bold
        ">
          AI Technical Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Question 1 of 8 • AI Engineering Track
        </p>

      </div>



      {/* Chat Area */}

      <div className="
        flex-1
        max-w-4xl
        w-full
        mx-auto
        p-6
        space-y-6
      ">

        {
          messages.map((message,index)=>(
            <ChatMessage
              key={index}
              {...message}
            />
          ))
        }

      </div>



      {/* Input */}

      <InterviewInput />

    </div>

  );
}