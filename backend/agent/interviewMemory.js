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
// Add message to Breeth
// ==========================================

async function addMessage(
  candidateId,
  role,
  content
) {

  // Always keep a local copy as fallback
  if (!localMemory[candidateId]) {
    localMemory[candidateId] = [];
  }

  localMemory[candidateId].push({
    role,
    content,
    timestamp: new Date().toISOString(),
  });


  // If Breeth isn't configured, stop here
  if (!BREETH_API_KEY) {
    return;
  }


  try {

    const response = await fetch(
      `${BREETH_ENDPOINT}/episodes`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
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


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Breeth memory write failed:",
        response.status,
        errorText
      );

      return;
    }


    console.log(
      `Breeth memory saved for candidate ${candidateId}`
    );

  } catch (error) {

    console.error(
      "Breeth memory connection error:",
      error.message
    );
  }
}


// ==========================================
// Retrieve conversation
// ==========================================

async function getConversation(
  candidateId
) {

  // If Breeth isn't configured,
  // use local memory.
  if (!BREETH_API_KEY) {

    return (
      localMemory[candidateId] || []
    );
  }


  try {

    const response = await fetch(
      `${BREETH_ENDPOINT}/search`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${BREETH_API_KEY}`,
        },

        body: JSON.stringify({
          query:
            `Interview history for candidate ${candidateId}`,

          group_id:
            `candidate-${candidateId}`,

          limit: 20,
        }),
      }
    );


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Breeth memory retrieval failed:",
        response.status,
        errorText
      );

      return (
        localMemory[candidateId] || []
      );
    }


    const data =
      await response.json();


    return (
      data.results ||
      data.memories ||
      data.items ||
      localMemory[candidateId] ||
      []
    );

  } catch (error) {

    console.error(
      "Breeth retrieval error:",
      error.message
    );


    return (
      localMemory[candidateId] || []
    );
  }
}


// ==========================================
// Clear local conversation
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