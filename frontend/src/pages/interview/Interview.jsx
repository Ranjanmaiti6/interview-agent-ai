import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import InterviewHeader from "../../components/interview/InterviewHeader";
import ChatMessage from "../../components/interview/ChatMessage";
import InterviewInput from "../../components/interview/InterviewInput";

export default function Interview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const candidateId = searchParams.get("id");

  const candidateName =
    candidateId === "1" ? "Riya Sharma" : "Arjun Patel";

  const totalQuestions = 8;

  const [questionNumber, setQuestionNumber] = useState(1);

  const [loading, setLoading] = useState(false);

  // NEW
  const [score, setScore] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
  });

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to your AI Technical Interview.\n\nLet's begin.\n\nExplain how Retrieval-Augmented Generation (RAG) works in an AI application.",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendAnswer = async (answer) => {
    if (!answer.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: answer,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer,
            questionNumber: questionNumber - 1,
            candidateId,
          }),
        }
      );

      const data = await response.json();

      // NEW
      if (data.score) {
        setScore(data.score);
      }

      // NEW
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `✅ Feedback\n\n${
            data.feedback || "Good answer."
          }`,
        },
        {
          role: "ai",
          text: `🎯 Next Question\n\n${
            data.nextQuestion || "Let's continue."
          }`,
        },
      ]);

      if (questionNumber >= totalQuestions) {
        setTimeout(() => {
          navigate("/report", {
            state: {
              score: data.score,
              strengths: data.strengths,
              gaps: data.gaps,
              recommendation: data.recommendation,
              candidateName,
            },
          });
        }, 1200);
      } else {
        setQuestionNumber((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Unable to connect to backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      <InterviewHeader
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        candidateName={candidateName}
        topic="AI Engineering"
        difficulty={
          questionNumber <= 2
            ? "Easy"
            : questionNumber <= 5
            ? "Medium"
            : "Hard"
        }
      />

      <div className="flex-1 overflow-y-auto">

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              text={message.text}
            />
          ))}

          {loading && (
            <div className="flex">
              <div className="bg-slate-800 rounded-xl px-5 py-3 text-blue-400 italic animate-pulse">
                🤖 AI is thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

      </div>

      <InterviewInput onSend={sendAnswer} />

    </div>
  );
}
