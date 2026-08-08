const curriculum =
  require("../data/curriculum.json");

const candidates =
  require("../data/candidates.json");

const {
  addMessage,
  getConversation,
  clearConversation,
} = require("./interviewMemory");

const {
  evaluateAnswer,
} = require("./aiService");

// ==========================================
// Interview questions
// ==========================================

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
// Generate interview question/evaluation
// ==========================================

async function generateQuestion(
  answer,
  questionNumber,
  candidateId
) {
  // ========================================
  // Validate identifier
  // ========================================

  const interviewId =
    String(candidateId);

  // ========================================
  // Find candidate
  // ========================================

  const candidate =
    candidates.find(
      (item) =>
        String(item.id) ===
        interviewId
    ) || {
      id: interviewId,

      name:
        "Employee Candidate",

      email:
        interviewId.includes("@")
          ? interviewId
          : "",
    };

  // ========================================
  // Current curriculum topic
  // ========================================

  const topic =
    curriculum[questionNumber] ||
    curriculum[0] ||
    {};

  // ========================================
  // Current question
  // ========================================

  const currentQuestion =
    questions[questionNumber] ||
    questions[0];

  // ========================================
  // 1. Retrieve previous interview memory
  // ========================================

  const previousConversation =
    await getConversation(
      interviewId
    );

  // ========================================
  // 2. Save candidate answer
  // ========================================

  await addMessage(
    interviewId,
    "user",
    answer
  );

  // ========================================
  // 3. Get updated conversation
  // ========================================

  const conversation =
    await getConversation(
      interviewId
    );

  // ========================================
  // 4. Evaluate answer
  // ========================================

  const evaluation =
    await evaluateAnswer({
      candidate,

      topic:
        topic.topic ||
        topic.name ||
        "AI Engineering",

      question:
        currentQuestion,

      answer,

      conversation,

      previousConversation,
    });

  // ========================================
  // 5. Save AI feedback
  // ========================================

  await addMessage(
    interviewId,
    "assistant",
    evaluation.feedback ||
      "Good answer."
  );

  // ========================================
  // 6. Determine next question
  // ========================================

  const nextQuestion =
    questions[
      questionNumber + 1
    ] ||
    "Interview Completed";

  // ========================================
  // 7. Score
  // ========================================

  const score =
    evaluation.score || {
      technical: 7,
      communication: 7,
      problemSolving: 7,
    };

  // ========================================
  // 8. Calculate average
  // ========================================

  const average =
    (
      Number(score.technical || 0) +
      Number(score.communication || 0) +
      Number(score.problemSolving || 0)
    ) / 3;

  // ========================================
  // 9. Recommendation
  // ========================================

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

  // ========================================
  // 10. Final conversation
  // ========================================

  const finalConversation =
    await getConversation(
      interviewId
    );

  // ========================================
  // 11. Clear memory after final question
  // ========================================

  if (questionNumber >= 7) {
    await clearConversation(
      interviewId
    );
  }

  // ========================================
  // 12. Return result
  // ========================================

  return {
    candidate:
      candidate.name,

    topic:
      topic.topic ||
      topic.name ||
      "AI Engineering",

    feedback:
      evaluation.feedback ||
      "Good answer.",

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