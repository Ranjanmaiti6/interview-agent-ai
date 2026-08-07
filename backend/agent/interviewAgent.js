const curriculum = require("../data/curriculum.json");
const candidates = require("../data/candidates.json");

const questions = [
  "Explain Retrieval-Augmented Generation (RAG).",
  "Why is chunking important in RAG?",
  "What is Few-shot Prompting?",
  "Explain how AI Agents work.",
  "What problem does MCP solve?",
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
    curriculum[questionNumber] || curriculum[0];

  // Mock scoring (replace with AI later)
  const score = {
    technical: Math.floor(Math.random() * 3) + 7,
    communication: Math.floor(Math.random() * 3) + 7,
    problemSolving: Math.floor(Math.random() * 3) + 7,
  };

  const feedback =
    answer.length > 40
      ? "Good explanation. Your answer covered the main concepts clearly."
      : "Your answer is a bit short. Try explaining your reasoning with more detail.";

  return {
  feedback,

  nextQuestion:
    questions[questionNumber + 1] ||
    "Interview Completed",

  score,

  strengths: [
    "Retrieval-Augmented Generation",
    "Prompt Engineering",
    "Vector Databases",
  ],

  gaps: [
    "Model Context Protocol",
    "Production Deployment",
    "AI Evaluation",
  ],

  recommendation:
    score.technical >= 8
      ? "Recommended for AI Engineering Internship."
      : "Needs more practice before technical interviews.",

  questionNumber: questionNumber + 1,
};
}

module.exports = {
  generateQuestion,
};