require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const interviewRoute = require("./routes/interview");
const employeeRoute = require("./routes/employee");
const authRoute = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 5001;


// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  "http://localhost:5174",
  "http://127.0.0.1:5174",

  // Production frontend
  "https://interview-agent-ai-frontend.vercel.app",
];


// Add FRONTEND_URL from Render environment
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL.replace(/\/$/, "")
  );
}


app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests with no origin
      // Example: Postman, curl, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin =
        origin.replace(/\/$/, "");

      if (
        allowedOrigins.includes(
          cleanOrigin
        )
      ) {
        return callback(null, true);
      }

      console.log(
        "CORS blocked origin:",
        origin
      );

      return callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
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

    credentials: true,
  })
);


// ==========================================
// Middleware
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ==========================================
// Uploaded files
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ==========================================
// API Routes
// ==========================================

// Authentication
app.use(
  "/api/auth",
  authRoute
);


// AI Interview
app.use(
  "/api/interview",
  interviewRoute
);


// Employee requests
app.use(
  "/api/employee",
  employeeRoute
);


// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,

    message:
      "AI Interview Agent Backend Running 🚀",

    port: PORT,

    services: {
      auth: "/api/auth",
      interview: "/api/interview",
      employee: "/api/employee",
      uploads: "/uploads",
    },
  });
});


// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message:
      "API endpoint not found.",

    path: req.originalUrl,
  });
});


// ==========================================
// Global Error Handler
// ==========================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Server error:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Internal server error.",
    });
  }
);


// ==========================================
// Start Server
// ==========================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "=========================================="
    );

    console.log(
      "AI Interview Agent Backend"
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Local: http://localhost:${PORT}`
    );

    console.log(
      `Uploads: http://localhost:${PORT}/uploads`
    );

    console.log(
      "Allowed frontend origins:"
    );

    allowedOrigins.forEach(
      (origin) => {
        console.log(`- ${origin}`);
      }
    );

    console.log(
      "=========================================="
    );
  }
);