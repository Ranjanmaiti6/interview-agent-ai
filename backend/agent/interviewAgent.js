const curriculum = require("../data/curriculum.json");
const candidates = require("../data/candidates.json");

const {
  addMessage,
  getConversation,
  clearConversation,
} = require("./interviewMemory");

const {
  evaluateAnswer,
} = require("./aiService");


const questions = [
  "Explain Retrieval-Augmented Generation (RAG).",

  "Why is chunking important in RAG?",

  "What is Few-shot Prompting?",

  "Explain how AI Agents work.",

  "What problem does Model Context Protocol (MCP) solve?",

  "How would you deploy an LLM application?",

  "How do you evaluate an AI system?",

  "Design a production-ready AI architecture.",
];


// ==========================================
// Generate Next Interview Question
// ==========================================

async function generateQuestion(
  answer,
  questionNumber,
  candidateId
) {

  const candidate =
    candidates.find(
      (candidate) =>
        candidate.id == candidateId
    ) || candidates[0];


  const topic =
    curriculum[questionNumber] ||
    curriculum[0];


  // ------------------------------------------
  // Save candidate answer
  // ------------------------------------------

  addMessage(
    candidateId,
    "user",
    answer
  );


  // ------------------------------------------
  // Get conversation memory
  // ------------------------------------------

  const conversation =
    getConversation(candidateId);


  // ------------------------------------------
  // Evaluate answer
  // ------------------------------------------

  const evaluation =
    await evaluateAnswer({
      candidate,

      topic:
        topic.topic ||
        topic.name ||
        "AI Engineering",

      question:
        questions[questionNumber],

      answer,

      conversation,
    });


  // ------------------------------------------
  // Save AI feedback
  // ------------------------------------------

  addMessage(
    candidateId,
    "assistant",
    evaluation.feedback
  );


  // ------------------------------------------
  // Next question
  // ------------------------------------------

  const nextQuestion =
    questions[questionNumber + 1] ||
    "Interview Completed";


  // ------------------------------------------
  // Score
  // ------------------------------------------

  const score =
    evaluation.score || {
      technical: 7,
      communication: 7,
      problemSolving: 7,
    };


  // ------------------------------------------
  // Recommendation
  // ------------------------------------------

  const average =
    (
      score.technical +
      score.communication +
      score.problemSolving
    ) / 3;


  let recommendation;


  if (average >= 8.5) {

    recommendation =
      "Excellent performance. Recommended for an AI Engineering Internship.";

  } else if (average >= 7) {

    recommendation =
      "Good performance. Strong fundamentals with room for improvement.";

  } else {

    recommendation =
      "Needs more practice before technical interviews.";
  }


  // ------------------------------------------
  // Get current conversation
  // ------------------------------------------

  const currentConversation =
    getConversation(candidateId);


  // ------------------------------------------
  // Clear memory after final question
  // ------------------------------------------

  if (questionNumber >= 7) {
    clearConversation(candidateId);
  }


  // ------------------------------------------
  // Return result
  // ------------------------------------------

  return {

    candidate:
      candidate.name,

    topic:
      topic.topic ||
      topic.name ||
      "AI Engineering",

    feedback:
      evaluation.feedback,

    nextQuestion,

    score,

    strengths:
      evaluation.strengths || [],

    gaps:
      evaluation.gaps || [],

    recommendation,

    conversation:
      currentConversation,

    questionNumber:
      questionNumber + 1,
  };
}


module.exports = {
  generateQuestion,
};