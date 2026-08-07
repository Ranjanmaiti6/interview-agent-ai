const curriculum =
require("../data/curriculum.json");

const candidates =
require("../data/candidates.json");


const {
askAI
} = require("./aiService");



async function generateQuestion(
answer,
questionNumber,
candidateId
){


const candidate =
candidates.find(
c=>c.id == candidateId
);



const topic =
curriculum[questionNumber]
||
curriculum[0];



const prompt = `

You are interviewing a candidate.

Candidate Name:
${candidate.name}


Candidate strengths:
${candidate.strengths}


Candidate weaknesses:
${candidate.weaknesses}


Current topic:
${topic.topic}


Candidate answer:
${answer}


Generate:

1. Short feedback
2. One difficult follow-up technical question


Return only this format:

Feedback:
...

Next Question:
...

`;



const result = await askAI(prompt);



return {

response: result,

questionNumber:
questionNumber + 1

};


}



module.exports={
generateQuestion
};