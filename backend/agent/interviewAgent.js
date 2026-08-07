const curriculum = require("../data/curriculum.json");
const candidates = require("../data/candidates.json");

const {
  addMessage,
  getConversation,
  clearConversation,
} = require("./interviewMemory");

const questions = [
  "Explain Retrieval-Augmented Generation (RAG).",
  "Why is chunking important in RAG?",
  "What is Few-shot Prompting?",
  "Explain how AI Agents work.",
  "What problem does Model Context Protocol (MCP) solve?",
  "How would you deploy an LLM application?",
  "How do you evaluate an AI system?",
  "Design a production-ready AI architecture."
];

async function generateQuestion(
  answer,
  questionNumber,
  candidateId
) {

  const candidate =
    candidates.find(
      (c) => c.id == candidateId
    ) || candidates[0];

  const topic =
    curriculum[questionNumber] ||
    curriculum[0];

  // Store candidate answer
  addMessage(
    candidateId,
    "user",
    answer
  );

  // Mock scoring (replace with AI later)
  const score = {
    technical:
      Math.floor(Math.random() * 3) + 7,

    communication:
      Math.floor(Math.random() * 3) + 7,

    problemSolving:
      Math.floor(Math.random() * 3) + 7,
  };

  // Generate feedback
  const feedback =
    answer.length > 40
      ? "Good explanation. Your answer covered the main concepts clearly."
      : "Your answer is a bit short. Try explaining your reasoning with more detail.";

  // Store AI feedback
  addMessage(
    candidateId,
    "assistant",
    feedback
  );

  const nextQuestion =
    questions[questionNumber + 1] ||
    "Interview Completed";

  const strengths = [
    "Retrieval-Augmented Generation",
    "Prompt Engineering",
    "Vector Databases",
  ];

  const gaps = [
    "Model Context Protocol",
    "Production Deployment",
    "AI Evaluation",
  ];

  const recommendation =
    score.technical >= 8
      ? "Recommended for AI Engineering Internship."
      : "Needs more practice before technical interviews.";

  const conversation =
    getConversation(candidateId);

  // Clear memory after last question
  if (questionNumber >= 7) {
    clearConversation(candidateId);
  }

  return {

    candidate: candidate.name,

    topic: topic.topic,

    feedback,

    nextQuestion,

    score,

    strengths,

    gaps,

    recommendation,

    conversation,

    questionNumber:
      questionNumber + 1,

  };

}

module.exports = {
  generateQuestion,
};