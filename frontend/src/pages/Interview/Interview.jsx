import { useState } from "react";

import InterviewHeader from "../../components/interview/InterviewHeader";
import ChatMessage from "../../components/interview/ChatMessage";
import InterviewInput from "../../components/interview/InterviewInput";


export default function Interview() {


  const [questionNumber, setQuestionNumber] = useState(1);


  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome! Explain how you would design a RAG based AI application."
    }
  ]);



  const sendAnswer = (answer) => {


    if(!answer.trim()) return;



    setMessages(prev => [
      ...prev,

      {
        role:"user",
        text:answer
      },


      {
        role:"ai",
        text:"Good explanation. Can you tell me why you selected that vector database?"
      }

    ]);



    setQuestionNumber(prev => prev + 1);

  };



  return (

    <div className="
      min-h-screen
      bg-slate-950
      flex
      flex-col
    ">


      <InterviewHeader
        questionNumber={questionNumber}
        totalQuestions={8}
      />



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



      <InterviewInput
        onSend={sendAnswer}
      />


    </div>

  );

}