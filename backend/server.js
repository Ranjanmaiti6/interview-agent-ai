const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const http = require("http");
const { Server } = require("socket.io");

const interviewRoute = require("./routes/interview");
=======
require("dotenv").config();
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a

const app = express();

const PORT = process.env.PORT || 5001;


// ==========================================
// CORS
// ==========================================
<<<<<<< HEAD

app.use(
  cors({
    origin: true,
=======

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://interview-agent-ai-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests from curl/Postman/server-side requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked:", origin);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
<<<<<<< HEAD
=======

>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
<<<<<<< HEAD
=======

    credentials: false,
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
  })
);


// ==========================================
// Middleware
// ==========================================

app.use(express.json());


// ==========================================
<<<<<<< HEAD
// Interview Routes
// ==========================================

app.use(
  "/api/interview",
  interviewRoute
);


// ==========================================
// Health Check
=======
// Health check
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
<<<<<<< HEAD
    message:
      "AI Interview Agent Backend Running 🚀",
=======
    message: "Interview Agent AI backend is running",
    environment: process.env.NODE_ENV || "development",
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
  });
});


// ==========================================
<<<<<<< HEAD
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
=======
// Interview routes
// ==========================================

const interviewRoutes =
  require("./routes/interview");

app.use(
  "/api/interview",
  interviewRoutes
);


// ==========================================
// 404 handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
});


// ==========================================
<<<<<<< HEAD
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
=======
// Error handler
// ==========================================

app.use((err, req, res, next) => {

  console.error("Backend error:", err);

  if (
    err.message &&
    err.message.startsWith("CORS blocked")
  ) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
});


// ==========================================
<<<<<<< HEAD
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
=======
// Start server
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  );
}); 
>>>>>>> 82dce38c5188180c8da0fa2af14b941e129b826a
