const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askAI(prompt) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content:
          "You are a senior AI engineer conducting a technical interview. Evaluate candidates fairly, ask relevant technical follow-up questions, and provide concise actionable feedback.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}


async function evaluateAnswer({
  candidate,
  topic,
  question,
  answer,
  conversation,
}) {

  const conversationText = conversation
    .map(
      (message) =>
        `${message.role}: ${message.text}`
    )
    .join("\n");


  const prompt = `
You are conducting a technical interview for an AI Engineering candidate.

Candidate:
${candidate.name}

Candidate strengths:
${candidate.strengths?.join(", ") || "Unknown"}

Candidate weaknesses:
${candidate.weaknesses?.join(", ") || "Unknown"}

Current topic:
${topic}

Current question:
${question}

Candidate's latest answer:
${answer}

Previous conversation:
${conversationText}


Evaluate the candidate's answer.

Return ONLY valid JSON in exactly this structure:

{
  "feedback": "Short constructive feedback about the answer.",
  "nextQuestion": "A technical follow-up question based on the candidate's answer.",
  "technical": 8,
  "communication": 8,
  "problemSolving": 7,
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "gaps": [
    "gap 1",
    "gap 2"
  ]
}

Rules:

- Scores must be integers from 1 to 10.
- Do not give high scores just because the answer is long.
- Evaluate technical correctness.
- Evaluate clarity of explanation.
- Evaluate reasoning and problem-solving.
- The follow-up question must relate to the candidate's answer.
- Do not repeat a question already asked.
- Keep feedback concise.
- Return JSON only.
`;

  const rawResponse = await askAI(prompt);

  try {

    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);

  } catch (error) {

    console.error(
      "AI JSON parsing error:",
      error
    );

    return {
      feedback:
        "The answer was evaluated, but the AI response could not be parsed correctly.",

      nextQuestion:
        "Can you explain your approach with a practical example?",

      technical: 7,

      communication: 7,

      problemSolving: 7,

      strengths: [],

      gaps: [],
    };
  }
}


module.exports = {
  askAI,
  evaluateAnswer,
};