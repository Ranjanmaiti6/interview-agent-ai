require("dotenv").config();

const BREETH_ENDPOINT =
  process.env.BREETH_ENDPOINT ||
  "https://api.thebreeth.com/v1";

const BREETH_API_KEY =
  process.env.BREETH_API_KEY;


// ==========================================
// Local fallback memory
// ==========================================

const localMemory = {};


// ==========================================
// Save message to local + Breeth
// ==========================================

async function addMessage(
  candidateId,
  role,
  content
) {

  if (!localMemory[candidateId]) {
    localMemory[candidateId] = [];
  }

  localMemory[candidateId].push({
    role,
    content,
    timestamp:
      new Date().toISOString(),
  });


  if (!BREETH_API_KEY) {
    return;
  }


  try {

    const response = await fetch(
      `${BREETH_ENDPOINT}/episodes`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${BREETH_API_KEY}`,
        },

        body: JSON.stringify({
          content:
            `Candidate ${candidateId} | ${role}: ${content}`,

          group_id:
            `candidate-${candidateId}`,
        }),
      }
    );


    const body =
      await response.text();


    if (!response.ok) {

      console.error(
        "Breeth write failed:",
        response.status,
        body
      );

      return;
    }


    console.log(
      `Breeth memory saved for candidate ${candidateId}`
    );

  } catch (error) {

    console.error(
      "Breeth write error:",
      error.message
    );
  }
}


// ==========================================
// Retrieve memory from Breeth
// ==========================================

async function getConversation(
  candidateId
) {

  // Local fallback
  const local =
    localMemory[candidateId] || [];


  if (!BREETH_API_KEY) {
    return local;
  }


  try {

    const response = await fetch(
      `${BREETH_ENDPOINT}/search`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${BREETH_API_KEY}`,
        },

        body: JSON.stringify({
          query:
            `Interview answers and feedback for candidate ${candidateId}`,

          group_id:
            `candidate-${candidateId}`,

          limit: 20,
        }),
      }
    );


    const body =
      await response.text();


    if (!response.ok) {

      console.error(
        "Breeth retrieval failed:",
        response.status,
        body
      );

      return local;
    }


    let data;

    try {

      data = JSON.parse(body);

    } catch (error) {

      console.error(
        "Breeth returned invalid JSON."
      );

      return local;
    }


    // ========================================
    // Log actual response once
    // ========================================

    console.log(
      "Breeth search response:",
      JSON.stringify(
        data,
        null,
        2
      )
    );


    // ========================================
    // Handle common Breeth response formats
    // ========================================

    let memories = [];


    if (
      Array.isArray(data)
    ) {

      memories = data;

    } else if (
      Array.isArray(
        data.results
      )
    ) {

      memories =
        data.results;

    } else if (
      Array.isArray(
        data.memories
      )
    ) {

      memories =
        data.memories;

    } else if (
      Array.isArray(
        data.items
      )
    ) {

      memories =
        data.items;

    }


    // ========================================
    // If Breeth has no searchable results yet,
    // use local memory
    // ========================================

    if (!memories.length) {

      return local;
    }


    // ========================================
    // Convert Breeth results into the format
    // our evaluator understands
    // ========================================

    const normalized =
      memories.map(
        (memory) => {

          const content =
            memory.content ||
            memory.text ||
            memory.fact ||
            memory.name ||
            JSON.stringify(
              memory
            );


          return {
            role:
              memory.role ||
              "memory",

            content,

            timestamp:
              memory.timestamp ||
              memory.created_at ||
              null,

            source:
              "breeth",
          };
        }
      );


    // Combine local conversation with
    // Breeth memory without crashing
    return [
      ...local,
      ...normalized,
    ];

  } catch (error) {

    console.error(
      "Breeth retrieval error:",
      error.message
    );

    return local;
  }
}


// ==========================================
// Clear local memory
// ==========================================

function clearConversation(
  candidateId
) {

  delete localMemory[candidateId];

  console.log(
    `Local memory cleared for candidate ${candidateId}`
  );
}


// ==========================================
// Exports
// ==========================================

module.exports = {
  addMessage,
  getConversation,
  clearConversation,
};