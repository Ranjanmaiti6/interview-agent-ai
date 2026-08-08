const express = require("express");

const router = express.Router();

const {
  generateQuestion,
} = require("../agent/interviewAgent");


// ==========================================
// Submit Interview Answer
// ==========================================

router.post(
  "/answer",
  async (req, res) => {

    try {

      const {
        answer,
        questionNumber,
        candidateId,
      } = req.body;


      // ------------------------------
      // Validation
      // ------------------------------

      if (!answer) {
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


      // ------------------------------
      // Generate response
      // ------------------------------

      const response =
        await generateQuestion(
          answer,
          Number(questionNumber),
          candidateId
        );


      // ------------------------------
      // Send response
      // ------------------------------

      return res.json({
        success: true,
        ...response,
      });

    } catch (error) {

      console.error(
        "Interview route error:",
        error
      );


      return res.status(500).json({
        success: false,

        error:
          error.message ||
          "Internal server error.",

      });
    }
  }
);


module.exports = router;