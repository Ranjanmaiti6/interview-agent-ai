const interviewSessions = {};

function createSession(candidateId) {
  if (!interviewSessions[candidateId]) {
    interviewSessions[candidateId] = [];
  }
}

function addMessage(candidateId, role, text) {
  createSession(candidateId);

  interviewSessions[candidateId].push({
    role,
    text,
    timestamp: new Date().toISOString(),
  });
}

function getConversation(candidateId) {
  createSession(candidateId);

  return interviewSessions[candidateId];
}

function clearConversation(candidateId) {
  delete interviewSessions[candidateId];
}

module.exports = {
  addMessage,
  getConversation,
  clearConversation,
};