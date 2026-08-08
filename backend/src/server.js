require("dotenv").config();

const express = require("express");
const cors = require("cors");

const interviewRoutes = require("./routes/interview");

const app = express();

const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle browser preflight requests
app.options("*", cors());

// JSON body parser
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Agent API Running 🚀",
  });
});

// Interview API
app.use("/api/interview", interviewRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});