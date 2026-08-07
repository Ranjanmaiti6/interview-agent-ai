const curriculum = require("../data/curriculum.json");
const candidates = require("../data/candidates.json");


function generateQuestion(
answer,
questionNumber,
candidateId = 1
){

const candidate =
candidates.find(
c => c.id === candidateId
);



let topic =
curriculum[questionNumber]
||
curriculum[0];



return {

feedback:
`Based on your answer, let's explore ${topic.topic}`,

nextQuestion:
`Explain your understanding of ${topic.topic}. How have you applied it in your projects?`,

candidate:
candidate.name,

questionNumber:
questionNumber + 1

};

}



module.exports={
generateQuestion
};