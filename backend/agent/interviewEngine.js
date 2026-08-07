const questions = require("../data/questions.json");

function getNextQuestion(questionNumber) {
  return questions[questionNumber] || null;
}

module.exports = {
  getNextQuestion
};