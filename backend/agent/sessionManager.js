const sessions = {};

function createSession(sessionId, candidate) {
  sessions[sessionId] = {
    candidate,
    messages: [],
    questionCount: 0,
    completed: false,
  };
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function addMessage(sessionId, role, content) {
  if (!sessions[sessionId]) return;

  sessions[sessionId].messages.push({
    role,
    content,
    timestamp: new Date().toISOString(),
  });
}

function endSession(sessionId) {
  if (sessions[sessionId]) {
    sessions[sessionId].completed = true;
  }
}

module.exports = {
  createSession,
  getSession,
  addMessage,
  endSession,
};