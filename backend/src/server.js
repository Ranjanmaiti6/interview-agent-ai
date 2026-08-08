const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5001;


// ==========================================
// CORS
// ==========================================

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

    credentials: false,
  })
);


// ==========================================
// Middleware
// ==========================================

app.use(express.json());


// ==========================================
// Health check
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Interview Agent AI backend is running",
    environment: process.env.NODE_ENV || "development",
  });
});


// ==========================================
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
});


// ==========================================
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
});


// ==========================================
// Start server
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  );
});