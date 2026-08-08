const express = require("express");

const router = express.Router();

const {
  generateQuestion,
} = require("../agent/interviewAgent");


// ------------------------------------
// POST /api/interview/answer
// ------------------------------------

router.post("/answer", async (req, res) => {
  try {

    const {
      answer,
      questionNumber,
      candidateId,
    } = req.body;


    // Validate answer
    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        error: "Answer is required",
      });
    }


    // Validate question number
    if (
      questionNumber === undefined ||
      questionNumber === null
    ) {
      return res.status(400).json({
        success: false,
        error: "Question number is required",
      });
    }


    // Validate candidate
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        error: "Candidate ID is required",
      });
    }


    console.log(
      "Interview answer received:",
      {
        candidateId,
        questionNumber,
      }
    );


    // Generate AI evaluation + next question
    const response =
      await generateQuestion(
        answer,
        Number(questionNumber),
        candidateId
      );


    // Send response to frontend
    return res.status(200).json({
      success: true,

      candidate:
        response.candidate,

      topic:
        response.topic,

      feedback:
        response.feedback,

      nextQuestion:
        response.nextQuestion,

      score:
        response.score,

      strengths:
        response.strengths,

      gaps:
        response.gaps,

      recommendation:
        response.recommendation,

      conversation:
        response.conversation,

      questionNumber:
        response.questionNumber,
    });


  } catch (error) {

    console.error(
      "Interview API error:",
      error
    );


    return res.status(500).json({
      success: false,

      error:
        "Failed to process interview answer.",

      message:
        error.message,
    });
  }
});


// ------------------------------------
// Export router
// ------------------------------------

module.exports = router;