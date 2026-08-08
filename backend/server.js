require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const interviewRoute = require("./routes/interview");

const app = express();

const PORT = process.env.PORT || 5001;


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ==========================================
// Middleware
// ==========================================

app.use(express.json());


// ==========================================
// Interview Routes
// ==========================================

app.use(
  "/api/interview",
  interviewRoute
);


// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Interview Agent Backend Running 🚀",
  });
});


// ==========================================
// Create HTTP Server
// ==========================================

const server = http.createServer(app);


// ==========================================
// Socket.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: true,
    methods: [
      "GET",
      "POST",
    ],
  },
});


// ==========================================
// Socket.IO Meeting System
// ==========================================

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );


  // ========================================
  // JOIN MEETING
  // ========================================

  socket.on(
    "join-meeting",
    (meetingId) => {
      if (!meetingId) {
        return;
      }

      socket.join(meetingId);

      const room =
        io.sockets.adapter.rooms.get(
          meetingId
        );

      const participantCount =
        room ? room.size : 0;

      console.log(
        `Meeting ${meetingId}: ${participantCount} participant(s)`
      );


      // First participant
      if (participantCount === 1) {
        socket.emit(
          "meeting-status",
          {
            status: "waiting",
          }
        );
      }


      // Second participant
      if (participantCount >= 2) {
        socket.emit(
          "meeting-status",
          {
            status: "in-progress",
          }
        );

        socket
          .to(meetingId)
          .emit(
            "meeting-status",
            {
              status: "in-progress",
            }
          );

        socket
          .to(meetingId)
          .emit(
            "user-joined"
          );
      }
    }
  );


  // ========================================
  // WEBRTC OFFER
  // ========================================

  socket.on(
    "offer",
    ({
      meetingId,
      offer,
    }) => {
      if (!meetingId || !offer) {
        return;
      }

      socket
        .to(meetingId)
        .emit(
          "offer",
          {
            offer,
          }
        );
    }
  );


  // ========================================
  // WEBRTC ANSWER
  // ========================================

  socket.on(
    "answer",
    ({
      meetingId,
      answer,
    }) => {
      if (!meetingId || !answer) {
        return;
      }

      socket
        .to(meetingId)
        .emit(
          "answer",
          {
            answer,
          }
        );
    }
  );


  // ========================================
  // ICE CANDIDATE
  // ========================================

  socket.on(
    "ice-candidate",
    ({
      meetingId,
      candidate,
    }) => {
      if (!meetingId || !candidate) {
        return;
      }

      socket
        .to(meetingId)
        .emit(
          "ice-candidate",
          {
            candidate,
          }
        );
    }
  );


  // ========================================
  // LEAVE MEETING
  // ========================================

  socket.on(
    "leave-meeting",
    (meetingId) => {
      if (!meetingId) {
        return;
      }

      console.log(
        `Socket ${socket.id} left meeting ${meetingId}`
      );

      socket.leave(meetingId);

      socket
        .to(meetingId)
        .emit(
          "user-left"
        );

      socket
        .to(meetingId)
        .emit(
          "meeting-status",
          {
            status: "waiting",
          }
        );
    }
  );


  // ========================================
  // DISCONNECT
  // ========================================

  socket.on(
    "disconnect",
    () => {
      console.log(
        "Socket disconnected:",
        socket.id
      );
    }
  );
});


// ==========================================
// Start Server
// ==========================================

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    `Socket.IO running on port ${PORT}`
  );
});