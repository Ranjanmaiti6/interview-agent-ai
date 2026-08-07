import ChatMessage from "../../components/interview/ChatMessage";
import InterviewInput from "../../components/interview/InterviewInput";
import InterviewHeader from "../../components/interview/InterviewHeader";


export default function Interview() {

  const messages = [
    {
      role: "ai",
      text: "Hello! I will be conducting your AI engineering interview today."
    },
    {
      role: "user",
      text: "I have built a RAG application using vector databases."
    }
  ];


  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      <InterviewHeader
        questionNumber={1}
        totalQuestions={8}
      />


      <div className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">

        {
          messages.map((message,index)=>(
            <ChatMessage
              key={index}
              {...message}
            />
          ))
        }

      </div>


      <InterviewInput />

    </div>
  );
}