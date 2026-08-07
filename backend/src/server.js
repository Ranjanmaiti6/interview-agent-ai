

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import your interview controller functions
import { startInterview, submitAnswerAndNext } from "./controllers/interviewController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Interview Agent API Running 🚀"
    });
});

// Interview API Routes
app.post("/api/interview/start", startInterview);
app.post("/api/interview/submit", submitAnswerAndNext);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});