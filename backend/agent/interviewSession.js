class InterviewSession {
  constructor(candidate) {
    this.candidate = candidate;
    this.currentQuestion = 0;
    this.totalQuestions = 8;

    this.history = [];

    this.topicsCovered = [];

    this.score = {
      technical: 0,
      communication: 0,
      problemSolving: 0
    };

    this.finished = false;
  }

  addAnswer(question, answer) {
    this.history.push({
      question,
      answer
    });
  }

  nextQuestion() {
    this.currentQuestion++;

    if (this.currentQuestion >= this.totalQuestions) {
      this.finished = true;
    }
  }
}

module.exports = InterviewSession;