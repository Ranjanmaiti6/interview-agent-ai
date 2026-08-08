import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import InterviewHeader from "../../components/interview/InterviewHeader";
import ChatMessage from "../../components/interview/ChatMessage";
import InterviewInput from "../../components/interview/InterviewInput";

// ==========================================
// Backend API URL
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";


// ==========================================
// Interview topics
// ==========================================

const topics = [
  "Retrieval-Augmented Generation",
  "Vector Databases",
  "Prompt Engineering",
  "AI Agents",
  "Model Context Protocol",
  "LLM Deployment",
  "AI Evaluation",
  "System Design",
];


// ==========================================
// Interview difficulties
// ==========================================

const difficulties = [
  "Easy",
  "Easy",
  "Medium",
  "Medium",
  "Medium",
  "Hard",
  "Hard",
  "Hard",
];


// ==========================================
// Interview component
// ==========================================

export default function Interview() {

  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();


  // ========================================
  // Candidate
  // ========================================

  const candidateId =
    searchParams.get("id");


  const candidateName =
    candidateId === "1"
      ? "Riya Sharma"
      : "Arjun Patel";


  // ========================================
  // Interview configuration
  // ========================================

  const totalQuestions = 8;


  // ========================================
  // State
  // ========================================

  const [
    questionNumber,
    setQuestionNumber,
  ] = useState(1);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    completed,
    setCompleted,
  ] = useState(false);


  // Latest score
  const [
    score,
    setScore,
  ] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
  });


  // All question scores
  const [
    allScores,
    setAllScores,
  ] = useState([]);


  // ========================================
  // Chat messages
  // ========================================

  const [
    messages,
    setMessages,
  ] = useState([
    {
      role: "ai",

      text:
        "Welcome to your AI Technical Interview.\n\n" +
        "Let's begin.\n\n" +
        "Explain how Retrieval-Augmented Generation (RAG) works in an AI application.",
    },
  ]);


  // ========================================
  // Scroll reference
  // ========================================

  const bottomRef =
    useRef(null);


  // ========================================
  // Auto scroll
  // ========================================

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    loading,
  ]);


  // ========================================
  // Send candidate answer
  // ========================================

  const sendAnswer = async (
    answer
  ) => {

    // --------------------------------------
    // Validation
    // --------------------------------------

    if (
      !answer ||
      !answer.trim() ||
      loading ||
      completed
    ) {
      return;
    }


    // --------------------------------------
    // Add candidate answer to chat
    // --------------------------------------

    setMessages((prev) => [

      ...prev,

      {
        role: "user",
        text: answer,
      },

    ]);


    // --------------------------------------
    // Loading
    // --------------------------------------

    setLoading(true);


    try {

      // ====================================
      // API request
      // ====================================

      const response =
        await fetch(
          `${API_URL}/api/interview/answer`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              answer,

              // Backend expects zero-based
              questionNumber:
                questionNumber - 1,

              candidateId,

            }),
          }
        );


      // ====================================
      // HTTP error
      // ====================================

      if (!response.ok) {

        throw new Error(
          `Backend returned ${response.status}`
        );

      }


      // ====================================
      // Parse response
      // ====================================

      const data =
        await response.json();


      console.log(
        "Interview response:",
        data
      );


      // ====================================
      // Score
      // ====================================

      const latestScore =
        data.score || {
          technical: 0,
          communication: 0,
          problemSolving: 0,
        };


      setScore(
        latestScore
      );


      // ====================================
      // Store all question scores
      // ====================================

      const updatedScores = [
        ...allScores,
        latestScore,
      ];


      setAllScores(
        updatedScores
      );


      // ====================================
      // Add feedback
      // ====================================

      setMessages((prev) => [

        ...prev,

        {
          role: "ai",

          text:
            `✅ Feedback\n\n${
              data.feedback ||
              "Good answer."
            }`,
        },

      ]);


      // ====================================
      // Interview completed
      // ====================================

      if (
        questionNumber >=
        totalQuestions
      ) {

        setCompleted(
          true
        );


        setMessages((prev) => [

          ...prev,

          {
            role: "ai",

            text:
              "🎉 Interview completed!\n\n" +
              "Your answers have been evaluated. " +
              "We're now preparing your personalized AI report.",
          },

        ]);


        // ----------------------------------
        // Navigate to report
        // ----------------------------------

        setTimeout(() => {

          navigate(
            "/report",
            {
              state: {

                score:
                  latestScore,

                allScores:
                  updatedScores,

                strengths:
                  data.strengths || [],

                gaps:
                  data.gaps || [],

                recommendation:
                  data.recommendation ||
                  "",

                candidateName,

              },
            }
          );

        }, 2500);


        return;
      }


      // ====================================
      // Next question
      // ====================================

      setMessages((prev) => [

        ...prev,

        {
          role: "ai",

          text:
            `🎯 Next Question\n\n${
              data.nextQuestion ||
              "Let's continue with the next question."
            }`,
        },

      ]);


      // ====================================
      // Increment question number
      // ====================================

      setQuestionNumber(
        (prev) =>
          prev + 1
      );

    } catch (error) {

      // ====================================
      // Error handling
      // ====================================

      console.error(
        "Interview error:",
        error
      );


      setMessages((prev) => [

        ...prev,

        {
          role: "ai",

          text:
            "⚠️ Backend error.\n\n" +
            `Unable to connect to ${API_URL}.\n\n` +
            "Please make sure your backend server is running.",
        },

      ]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // Completion screen
  // ==========================================

  if (completed) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

        <div className="text-center max-w-xl w-full">

          <div className="text-6xl mb-6">
            🎉
          </div>


          <h1 className="text-4xl md:text-5xl font-black text-white">
            Interview Completed
          </h1>


          <p className="text-slate-400 text-lg mt-4">
            Great work, {candidateName}.
          </p>


          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="text-4xl mb-5">
              🤖
            </div>


            <h2 className="text-xl font-bold text-white">
              Generating Your AI Report...
            </h2>


            <p className="text-slate-400 mt-4 leading-7">

              We're analyzing your technical
              answers, strengths, knowledge gaps,
              and overall interview performance.

            </p>


            <div className="mt-8 w-full bg-slate-800 rounded-full h-2 overflow-hidden">

              <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full" />

            </div>


            <p className="text-slate-500 text-sm mt-4">
              Please wait...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // Interview screen
  // ==========================================

  return (

    <div className="min-h-screen bg-slate-950 flex flex-col">


      {/* ====================================
          Header
      ==================================== */}

      <InterviewHeader

        questionNumber={
          questionNumber
        }

        totalQuestions={
          totalQuestions
        }

        candidateName={
          candidateName
        }

        topic={
          topics[
            questionNumber - 1
          ]
        }

        difficulty={
          difficulties[
            questionNumber - 1
          ]
        }

      />


      {/* ====================================
          Chat area
      ==================================== */}

      <div className="flex-1 overflow-y-auto">

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">


          {/* --------------------------------
              Messages
          -------------------------------- */}

          {messages.map(
            (
              message,
              index
            ) => (

              <ChatMessage

                key={index}

                role={
                  message.role
                }

                text={
                  message.text
                }

              />

            )
          )}


          {/* --------------------------------
              Loading indicator
          -------------------------------- */}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-slate-800 rounded-xl px-5 py-3 text-blue-400 italic animate-pulse">

                🤖 AI is thinking...

              </div>

            </div>

          )}


          {/* --------------------------------
              Bottom scroll target
          -------------------------------- */}

          <div
            ref={bottomRef}
          />

        </div>

      </div>


      {/* ====================================
          Answer input
      ==================================== */}

      <InterviewInput
        onSend={
          sendAnswer
        }
      />

    </div>

  );

}