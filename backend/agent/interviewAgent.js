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


  // ==========================================
  // 1. Retrieve previous interview memory
  // ==========================================

  const previousConversation =
    await getConversation(candidateId);


  // ==========================================
  // 2. Save current candidate answer
  // ==========================================

  await addMessage(
    candidateId,
    "user",
    answer
  );


  // ==========================================
  // 3. Get updated conversation
  // ==========================================

  const conversation =
    await getConversation(candidateId);


  // ==========================================
  // 4. Evaluate using interview history
  // ==========================================

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

      previousConversation,

    });


  // ==========================================
  // 5. Save AI feedback to memory
  // ==========================================

  await addMessage(
    candidateId,
    "assistant",
    evaluation.feedback
  );


  // ==========================================
  // 6. Determine next question
  // ==========================================

  const nextQuestion =
    questions[questionNumber + 1] ||
    "Interview Completed";


  // ==========================================
  // 7. Score
  // ==========================================

  const score =
    evaluation.score || {
      technical: 7,
      communication: 7,
      problemSolving: 7,
    };


  // ==========================================
  // 8. Calculate recommendation
  // ==========================================

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


  // ==========================================
  // 9. Final conversation state
  // ==========================================

  const finalConversation =
    await getConversation(candidateId);


  // ==========================================
  // 10. Clear local memory after interview
  // ==========================================

  if (questionNumber >= 7) {
    clearConversation(candidateId);
  }


  // ==========================================
  // 11. Return interview result
  // ==========================================

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
      finalConversation,

    questionNumber:
      questionNumber + 1,
  };
}


module.exports = {
  generateQuestion,
};