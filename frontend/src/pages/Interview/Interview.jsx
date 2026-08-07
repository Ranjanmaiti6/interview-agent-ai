import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import InterviewHeader from "../../components/Interview/InterviewHeader";
import ChatMessage from "../../components/Interview/ChatMessage";
import InterviewInput from "../../components/Interview/InterviewInput";


export default function Interview(){
  const [searchParams] = useSearchParams();

const candidateId = searchParams.get("id");
console.log(candidateId);git

const [questionNumber,setQuestionNumber] = useState(0);



const [messages,setMessages] = useState([
{
role:"ai",
text:"Explain how you would design a RAG based AI application."
}
]);



const sendAnswer = async(answer)=>{


// show user answer

setMessages(prev=>[
...prev,
{
role:"user",
text:answer
}
]);



// send to backend

const response = await fetch(
"http://localhost:5000/api/interview/answer",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

answer:answer,

questionNumber:questionNumber,
candidateId: candidateId


})

}

);



const data = await response.json();



// show AI response

setMessages(prev=>[
...prev,
{
role:"ai",
text:data.nextQuestion
}
]);



setQuestionNumber(data.questionNumber);


};



return (

<div className="
min-h-screen
bg-slate-950
flex
flex-col
">


<InterviewHeader

questionNumber={questionNumber+1}

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