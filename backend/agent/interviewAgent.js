const curriculum = require("../data/curriculum.json");
const candidates = require("../data/candidates.json");

const {
  addMessage,
  getConversation,
  clearConversation,
} = require("./interviewMemory");

const {
  evaluateAnswer,
} = require("../services/aiService");

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

async function generateQuestion(
  answer,
  questionNumber,
  candidateId
) {

  // Find candidate
  const candidate =
    candidates.find(
      (c) => c.id == candidateId
    ) || candidates[0];


  // Find current curriculum topic
  const topic =
    curriculum[questionNumber] ||
    curriculum[0];


  // Store candidate answer
  addMessage(
    candidateId,
    "user",
    answer
  );


  // Get complete conversation
  const conversation =
    getConversation(candidateId);


  // Ask AI to evaluate the answer
  const evaluation =
    await evaluateAnswer({
      candidate,
      topic: topic.topic,
      question:
        questions[questionNumber],
      answer,
      conversation,
    });


  // Store AI feedback
  addMessage(
    candidateId,
    "assistant",
    evaluation.feedback
  );


  // Convert AI scores into the format
  // expected by the frontend
  const score = {
    technical:
      evaluation.technical || 0,

    communication:
      evaluation.communication || 0,

    problemSolving:
      evaluation.problemSolving || 0,
  };


  // AI-generated next question
  const nextQuestion =
    evaluation.nextQuestion ||
    questions[questionNumber + 1] ||
    "Interview Completed";


  // AI-generated strengths
  const strengths =
    evaluation.strengths || [];


  // AI-generated knowledge gaps
  const gaps =
    evaluation.gaps || [];


  // Generate recommendation
  const recommendation =
    score.technical >= 8
      ? "Recommended for AI Engineering Internship."
      : "Needs more practice before technical interviews.";


  // Get latest conversation
  const currentConversation =
    getConversation(candidateId);


  // Save conversation before clearing it
  const responseConversation =
    [...currentConversation];


  // Clear memory after question 8
  if (questionNumber >= 7) {
    clearConversation(candidateId);
  }


  // Return response to frontend
  return {

    candidate:
      candidate.name,

    topic:
      topic.topic,

    feedback:
      evaluation.feedback,

    nextQuestion,

    score,

    strengths,

    gaps,

    recommendation,

    conversation:
      responseConversation,

    questionNumber:
      questionNumber + 1,

  };
}


module.exports = {
  generateQuestion,
};