const express = require("express");

const router = express.Router();

const {
  generateQuestion
} = require("../agent/interviewAgent");



router.post("/answer",async(req,res)=> {

  const {
    answer,
    questionNumber,
    candidateId
  } = req.body;


const response = await generateQuestion(
answer,
questionNumber,
candidateId
);


  res.json(response);

});


module.exports = router;