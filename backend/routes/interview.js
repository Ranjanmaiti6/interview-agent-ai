const express = require("express");

const router = express.Router();

const {
  generateQuestion,
} = require("../agent/interviewAgent");


// ==========================================
// POST /api/interview/answer
// ==========================================

router.post("/answer", async (req, res) => {

  try {

    const {
      answer,
      questionNumber,
      candidateId,
    } = req.body;


    // ========================================
    // Validate request
    // ========================================

    if (
      typeof answer !== "string" ||
      !answer.trim()
    ) {

      return res.status(400).json({
        success: false,
        error: "Answer is required.",
      });

    }


    if (
      questionNumber === undefined ||
      questionNumber === null
    ) {

      return res.status(400).json({
        success: false,
        error:
          "Question number is required.",
      });

    }


    if (!candidateId) {

      return res.status(400).json({
        success: false,
        error:
          "Candidate ID is required.",
      });

    }


    // ========================================
    // Convert question number
    // ========================================

    const parsedQuestionNumber =
      Number(questionNumber);


    if (
      Number.isNaN(
        parsedQuestionNumber
      )
    ) {

      return res.status(400).json({
        success: false,
        error:
          "Question number must be a number.",
      });

    }


    // ========================================
    // Generate evaluation + next question
    // ========================================

    const result =
      await generateQuestion(
        answer.trim(),
        parsedQuestionNumber,
        candidateId
      );


    // ========================================
    // Return result
    // ========================================

    return res.status(200).json({

      success: true,

      candidate:
        result.candidate,

      topic:
        result.topic,

      feedback:
        result.feedback,

      nextQuestion:
        result.nextQuestion,

      score:
        result.score,

      strengths:
        result.strengths || [],

      gaps:
        result.gaps || [],

      recommendation:
        result.recommendation || "",

      questionNumber:
        result.questionNumber,

    });


  } catch (error) {

    console.error(
      "Interview route error:",
      error
    );


    return res.status(500).json({

      success: false,

      error:
        "Unable to process interview answer.",

      message:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,

    });

  }

});


module.exports = router;