require("dotenv").config();

const express = require("express");
const cors = require("cors");

const interviewRoute = require("../routes/interview");

const app = express();

const PORT = process.env.PORT || 5001;


// ==============================
// CORS
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ==============================
// Middleware
// ==============================

app.use(express.json());


// ==============================
// Interview Routes
// ==============================

app.use(
  "/api/interview",
  interviewRoute
);


// ==============================
// Health Check
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Agent Backend Running 🚀",
  });
});


// ==============================
// Start Server
// ==============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});