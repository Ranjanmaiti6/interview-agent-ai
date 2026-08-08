const express = require("express");

const router = express.Router();

const {
  generateQuestion,
} = require("../agent/interviewAgent");


router.post("/answer", async (req, res) => {

  try {

    const {
      answer,
      questionNumber,
      candidateId,
    } = req.body;


    if (!answer) {
      return res.status(400).json({
        error: "Answer is required",
      });
    }


    const response =
      await generateQuestion(
        answer,
        Number(questionNumber),
        candidateId
      );


    res.json(response);

  } catch (error) {

    console.error(
      "Interview API error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to process interview answer",
    });

  }

});


module.exports = router;