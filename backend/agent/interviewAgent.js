const questions = [

"Explain how RAG works in an AI application.",

"Why do we use vector databases?",

"Explain embeddings and similarity search.",

"How would you deploy an AI system in production.",

"Explain prompt engineering techniques.",

"What are AI agents and how do they work?",

"Explain MCP architecture.",

"How do you evaluate an LLM application?"

];



function generateQuestion(
answer,
questionNumber
){


let next =
questions[questionNumber]
||
"Tell me about your biggest AI project.";



return {

feedback:
"Good answer. Let's explore deeper.",


nextQuestion: next,


questionNumber:
questionNumber + 1


};


}



module.exports={
generateQuestion
};