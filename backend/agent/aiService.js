const OpenAI = require("openai");


// ==========================================
// OpenAI Client
// ==========================================

let client = null;

if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}


// ==========================================
// Topic-Specific Mock Evaluation
// ==========================================

function mockEvaluation({
  topic,
  answer,
  conversation = [],
}) {
  const text = answer.trim().toLowerCase();

  const length = text.length;

  let technical = 6;
  let communication = 6;
  let problemSolving = 6;

  let feedback = "";
  let strengths = [];
  let gaps = [];


  // ==========================================
  // RAG
  // ==========================================

  if (
    topic.includes("Retrieval-Augmented") ||
    topic.includes("RAG")
  ) {
    if (
      text.includes("retriev") &&
      text.includes("document") &&
      text.includes("vector")
    ) {
      technical = 9;
      communication = 8;
      problemSolving = 8;

      feedback =
        "Strong RAG explanation. You correctly described retrieving relevant information from a vector-based knowledge source and providing that context to the language model.";

      strengths = [
        "RAG architecture",
        "Vector retrieval",
        "Context grounding",
      ];

      gaps = [
        "Reranking strategies",
        "Retrieval evaluation",
      ];
    } else {
      technical = length > 80 ? 7 : 5;
      communication = length > 80 ? 7 : 6;
      problemSolving = 6;

      feedback =
        "You identified part of the RAG concept, but the explanation should cover document ingestion, chunking, embeddings, vector retrieval, context injection, and generation.";

      strengths = [
        "Basic RAG understanding",
      ];

      gaps = [
        "Embeddings",
        "Vector retrieval",
        "Context injection",
      ];
    }
  }


  // ==========================================
  // Chunking
  // ==========================================

  else if (
    topic.toLowerCase().includes("chunking")
  ) {
    if (
      text.includes("chunk") &&
      (
        text.includes("context") ||
        text.includes("retriev") ||
        text.includes("embedding")
      )
    ) {
      technical = 9;
      communication = 8;
      problemSolving = 8;

      feedback =
        "Good explanation of chunking. You connected smaller document segments with better retrieval and context handling.";

      strengths = [
        "Document chunking",
        "Retrieval understanding",
        "Context management",
      ];

      gaps = [
        "Chunk overlap",
        "Semantic chunking",
      ];
    } else {
      technical = length > 80 ? 7 : 5;
      communication = length > 80 ? 7 : 6;
      problemSolving = 6;

      feedback =
        "Your answer should explain why large documents are divided into smaller chunks and how chunk size affects retrieval quality and LLM context.";

      strengths = [
        "Basic chunking awareness",
      ];

      gaps = [
        "Chunk size selection",
        "Overlap",
        "Retrieval quality",
      ];
    }
  }


  // ==========================================
  // Few-shot Prompting
  // ==========================================

  else if (
    topic.toLowerCase().includes("few-shot")
  ) {
    if (
      text.includes("example") &&
      text.includes("prompt")
    ) {
      technical = 9;
      communication = 8;
      problemSolving = 8;

      feedback =
        "Good understanding of few-shot prompting. You correctly connected examples in the prompt with guiding the model toward the desired output.";

      strengths = [
        "Prompt engineering",
        "Few-shot learning",
        "Model instruction",
      ];

      gaps = [
        "Example selection",
        "Prompt token efficiency",
      ];
    } else {
      technical = length > 80 ? 7 : 5;
      communication = length > 80 ? 7 : 6;
      problemSolving = 6;

      feedback =
        "Explain few-shot prompting using examples. Describe how providing several input-output examples helps guide the model's expected behavior.";

      strengths = [
        "Prompting fundamentals",
      ];

      gaps = [
        "Few-shot examples",
        "Prompt design",
      ];
    }
  }


  // ==========================================
  // AI Agents
  // ==========================================

  else if (
    topic.toLowerCase().includes("agent")
  ) {
    if (
      text.includes("tool") &&
      (
        text.includes("reason") ||
        text.includes("plan") ||
        text.includes("action")
      )
    ) {
      technical = 9;
      communication = 8;
      problemSolving = 9;

      feedback =
        "Strong explanation of AI agents. You described the relationship between reasoning, planning, tool usage, actions, and feedback.";

      strengths = [
        "Agent architecture",
        "Tool calling",
        "Reasoning and planning",
      ];

      gaps = [
        "Agent memory",
        "Failure handling",
      ];
    } else {
      technical = length > 80 ? 7 : 5;
      communication = length > 80 ? 7 : 6;
      problemSolving = length > 80 ? 7 : 5;

      feedback =
        "Your answer should explain how an AI agent observes a task, reasons about it, selects tools or actions, and uses the results to continue toward a goal.";

      strengths = [
        "Basic agent understanding",
      ];

      gaps = [
        "Tool calling",
        "Planning",
        "Agent loops",
      ];
    }
  }


  // ==========================================
  // MCP
  // ==========================================

  else if (
    topic.toLowerCase().includes("mcp")
  ) {
    if (
      text.includes("model") &&
      text.includes("context")
    ) {
      technical = 8;
      communication = 8;
      problemSolving = 8;

      feedback =
        "Good MCP explanation. You identified its role in connecting AI applications with external tools and context in a standardized way.";

      strengths = [
        "MCP fundamentals",
        "Tool integration",
      ];

      gaps = [
        "MCP clients and servers",
        "Resources and tools",
      ];
    } else {
      technical = length > 80 ? 7 : 5;
      communication = length > 80 ? 7 : 6;
      problemSolving = 6;

      feedback =
        "Explain MCP more precisely by discussing how it standardizes the way AI applications interact with external tools, resources, and context.";

      strengths = [
        "Basic MCP awareness",
      ];

      gaps = [
        "MCP architecture",
        "MCP tools and resources",
      ];
    }
  }


  // ==========================================
  // Deployment
  // ==========================================

  else if (
    topic.toLowerCase().includes("deploy")
  ) {
    if (
      text.includes("docker") ||
      text.includes("cloud") ||
      text.includes("api")
    ) {
      technical = 8;
      communication = 8;
      problemSolving = 9;

      feedback =
        "Good deployment-oriented answer. You considered practical infrastructure for taking an LLM application into production.";

      strengths = [
        "Deployment fundamentals",
        "API architecture",
        "Production thinking",
      ];

      gaps = [
        "Monitoring",
        "Scaling",
        "Security",
      ];
    } else {
      technical = length > 100 ? 7 : 5;
      communication = length > 100 ? 7 : 6;
      problemSolving = length > 100 ? 7 : 5;

      feedback =
        "Expand the deployment discussion by covering APIs, containers, cloud infrastructure, secrets management, monitoring, scaling, and reliability.";

      strengths = [
        "Basic deployment understanding",
      ];

      gaps = [
        "Cloud deployment",
        "Monitoring",
        "Scalability",
      ];
    }
  }


  // ==========================================
  // AI Evaluation
  // ==========================================

  else if (
    topic.toLowerCase().includes("evaluate")
  ) {
    if (
      text.includes("metric") ||
      text.includes("accuracy") ||
      text.includes("evaluation")
    ) {
      technical = 8;
      communication = 8;
      problemSolving = 9;

      feedback =
        "Good evaluation approach. You recognized that AI systems need measurable criteria rather than relying only on subjective judgment.";

      strengths = [
        "AI evaluation",
        "Metrics",
        "Quality measurement",
      ];

      gaps = [
        "LLM-as-a-judge",
        "Evaluation datasets",
      ];
    } else {
      technical = length > 100 ? 7 : 5;
      communication = length > 100 ? 7 : 6;
      problemSolving = length > 100 ? 7 : 5;

      feedback =
        "Explain how you would evaluate an AI system using representative test datasets, quality metrics, human evaluation, and production monitoring.";

      strengths = [
        "Evaluation awareness",
      ];

      gaps = [
        "Evaluation metrics",
        "Test datasets",
        "Monitoring",
      ];
    }
  }


  // ==========================================
  // System Design
  // ==========================================

  else if (
    topic.toLowerCase().includes("architecture") ||
    topic.toLowerCase().includes("system design")
  ) {
    if (
      text.includes("api") &&
      (
        text.includes("database") ||
        text.includes("vector")
      )
    ) {
      technical = 9;
      communication = 8;
      problemSolving = 9;

      feedback =
        "Strong system-design answer. You considered multiple production components rather than focusing only on the language model.";

      strengths = [
        "System architecture",
        "Production design",
        "Scalability thinking",
      ];

      gaps = [
        "Observability",
        "Security",
        "Failure recovery",
      ];
    } else {
      technical = length > 150 ? 7 : 5;
      communication = length > 150 ? 7 : 6;
      problemSolving = length > 150 ? 7 : 5;

      feedback =
        "For a production architecture, explain the major components, data flow, APIs, model layer, storage, retrieval, monitoring, security, and failure handling.";

      strengths = [
        "Architecture fundamentals",
      ];

      gaps = [
        "Scalability",
        "Observability",
        "Security",
      ];
    }
  }


  // ==========================================
  // Generic Fallback
  // ==========================================

  else {
    if (length > 150) {
      technical = 8;
      communication = 8;
      problemSolving = 8;

      feedback =
        "Good detailed answer. You explained the concept with reasonable depth. Try adding a concrete implementation example to make the answer stronger.";

      strengths = [
        "Technical explanation",
        "Communication",
      ];

      gaps = [
        "Concrete implementation examples",
      ];
    } else if (length > 70) {
      technical = 7;
      communication = 7;
      problemSolving = 7;

      feedback =
        "Reasonable answer, but you can improve it by adding implementation details, examples, and explaining your reasoning.";

      strengths = [
        "Basic technical understanding",
      ];

      gaps = [
        "Implementation details",
        "Examples",
      ];
    } else {
      technical = 5;
      communication = 6;
      problemSolving = 5;

      feedback =
        "Your answer is too short to fully evaluate. Explain the concept, how it works, and give a practical example.";

      strengths = [];

      gaps = [
        "Technical depth",
        "Examples",
        "Reasoning",
      ];
    }
  }


  // ==========================================
  // Add memory-aware feedback
  // ==========================================

  const previousUserMessages =
    conversation.filter(
      (message) =>
        message.role === "user"
    );

  if (previousUserMessages.length > 1) {
    feedback +=
      " Your response is also being considered in the context of your previous interview answers.";
  }


  return {
    feedback,

    score: {
      technical,
      communication,
      problemSolving,
    },

    strengths,

    gaps,
  };
}


// ==========================================
// Main Evaluation Function
// ==========================================

async function evaluateAnswer({
  candidate,
  topic,
  question,
  answer,
  conversation = [],
}) {

  // ==========================================
  // No OpenAI API key
  // ==========================================

  if (!client) {
    console.log(
      "OPENAI_API_KEY not configured. Using topic-aware mock evaluation."
    );

    return mockEvaluation({
      topic,
      answer,
      conversation,
    });
  }


  // ==========================================
  // Real OpenAI Evaluation
  // ==========================================

  const prompt = `
You are a senior AI engineer conducting a technical interview.

Candidate:
${candidate.name}

Topic:
${topic}

Question:
${question}

Candidate Answer:
${answer}

Previous Interview Conversation:
${JSON.stringify(
  conversation,
  null,
  2
)}

Evaluate the candidate's answer while considering
their previous interview responses.

Return ONLY valid JSON in this exact structure:

{
  "feedback": "useful and specific feedback",
  "score": {
    "technical": 0,
    "communication": 0,
    "problemSolving": 0
  },
  "strengths": [],
  "gaps": []
}

Rules:

- Scores must be between 0 and 10.
- Give specific feedback.
- Consider the candidate's previous answers.
- Identify repeated strengths.
- Identify knowledge gaps.
- Do not include markdown.
- Do not include anything outside the JSON.
`;


  try {

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content:
              "You are a senior AI engineer evaluating technical interview answers.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,
      });


    const content =
      response.choices[0].message.content;


    try {

      return JSON.parse(content);

    } catch (parseError) {

      console.error(
        "Failed to parse OpenAI response:"
      );

      console.error(content);

      return mockEvaluation({
        topic,
        answer,
        conversation,
      });
    }

  } catch (error) {

    console.error(
      "OpenAI evaluation failed:",
      error.message
    );

    return mockEvaluation({
      topic,
      answer,
      conversation,
    });
  }
}


// ==========================================
// Export
// ==========================================

module.exports = {
  evaluateAnswer,
};