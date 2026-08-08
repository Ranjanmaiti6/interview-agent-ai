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
      meetingId,
      employeeEmail,
    } = req.body;

    // ========================================
    // Validate answer
    // ========================================

    if (
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Answer is required.",
      });
    }

    // ========================================
    // Validate question number
    // ========================================

    if (
      questionNumber === undefined ||
      questionNumber === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question number is required.",
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
        message:
          "Question number must be a number.",
      });
    }

    // ========================================
    // Candidate identifier
    // ========================================
    //
    // Existing candidate pages can still send
    // candidateId.
    //
    // Employee interviews can use the email
    // when candidateId is not available.
    // ========================================

    const interviewCandidateId =
      candidateId ||
      employeeEmail ||
      meetingId;

    if (!interviewCandidateId) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate, employee email, or meeting ID is required.",
      });
    }

    // ========================================
    // Log interview information
    // ========================================

    console.log(
      "Processing interview answer:",
      {
        candidateId:
          candidateId || null,

        employeeEmail:
          employeeEmail || null,

        meetingId:
          meetingId || null,

        questionNumber:
          parsedQuestionNumber,
      }
    );

    // ========================================
    // Generate evaluation + next question
    // ========================================

    const result =
      await generateQuestion(
        answer.trim(),
        parsedQuestionNumber,
        interviewCandidateId
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
        result.score || {
          technical: 0,
          communication: 0,
          problemSolving: 0,
        },

      strengths:
        result.strengths || [],

      gaps:
        result.gaps || [],

      recommendation:
        result.recommendation || "",

      questionNumber:
        result.questionNumber,

      // Keep meeting information available
      // to the frontend.

      meetingId:
        meetingId || null,

      employeeEmail:
        employeeEmail || null,
    });

  } catch (error) {
    console.error(
      "Interview route error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to process interview answer.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
});

module.exports = router;