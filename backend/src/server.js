require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// ==========================================
// Routes
// ==========================================

const interviewRoute =
  require("./routes/interview");

const reportsRoute =
  require("./routes/reports");

const employeeRoute =
  require("./routes/employee");

const meetingsRoute =
  require("./routes/meetings");

const authRoute =
  require("./routes/auth");

const app = express();

const PORT =
  process.env.PORT || 5001;

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  "http://localhost:5174",
  "http://127.0.0.1:5174",

  "https://interview-agent-ai-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / curl / server requests
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.log(
        "CORS blocked origin:",
        origin
      );

      return callback(
        new Error(
          `CORS blocked for origin: ${origin}`
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
      "Accept",
    ],

    credentials: true,
  })
);

// ==========================================
// Middleware
// ==========================================

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// Request logger
// ==========================================

app.use(
  (req, res, next) => {
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );

    next();
  }
);

// ==========================================
// Uploaded files
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// ==========================================
// API routes
// ==========================================

app.use(
  "/api/auth",
  authRoute
);

app.use(
  "/api/interview",
  interviewRoute
);

app.use(
  "/api/reports",
  reportsRoute
);

app.use(
  "/api/employee",
  employeeRoute
);

app.use(
  "/api/meetings",
  meetingsRoute
);

// ==========================================
// Health check
// ==========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,

      message:
        "AI Interview Agent Backend Running 🚀",

      port: PORT,

      services: {
        auth:
          "/api/auth",

        interview:
          "/api/interview",

        reports:
          "/api/reports",

        employee:
          "/api/employee",

        meetings:
          "/api/meetings",

        uploads:
          "/uploads",
      },
    });
  }
);

// ==========================================
// Meetings health check
// ==========================================

app.get(
  "/api/meetings/health",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Meetings API is running.",
    });
  }
);

// ==========================================
// Reports health check
// ==========================================

app.get(
  "/api/reports/health",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Reports API is running.",
    });
  }
);

// ==========================================
// 404
// ==========================================

app.use(
  (req, res) => {
    console.log(
      "404:",
      req.method,
      req.originalUrl
    );

    res.status(404).json({
      success: false,

      message:
        "API endpoint not found.",

      path:
        req.originalUrl,
    });
  }
);

// ==========================================
// Global error handler
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
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
// Start server
// ==========================================

app.listen(
  PORT,
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
      `Auth: http://localhost:${PORT}/api/auth`
    );

    console.log(
      `Interview: http://localhost:${PORT}/api/interview`
    );

    console.log(
      `Reports: http://localhost:${PORT}/api/reports`
    );

    console.log(
      `Meetings: http://localhost:${PORT}/api/meetings`
    );

    console.log(
      `Uploads: http://localhost:${PORT}/uploads`
    );

    console.log(
      "=========================================="
    );
  }
);