require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");


// ==========================================
// Routes
// ==========================================

const interviewRoute =
  require("./routes/interview");

const employeeRoute =
  require("./routes/employee");

const meetingsRoute =
  require("./routes/meetings");

const authRoute =
  require("./routes/auth");


// ==========================================
// App
// ==========================================

const app = express();

const PORT =
  process.env.PORT || 5001;


// ==========================================
// Allowed Frontend Origins
// ==========================================

const allowedOrigins = [

  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  "http://localhost:5174",
  "http://127.0.0.1:5174",

  // Production
  "https://interview-agent-ai-frontend.vercel.app",
];


// ==========================================
// CORS
// ==========================================

app.use(
  cors({

    origin: (origin, callback) => {

      // Allow requests with no origin
      // Postman, curl, server-to-server, etc.
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
    ],


    credentials: true,
  })
);


// ==========================================
// Body Middleware
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
// Uploaded Files
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
// API ROUTES
// ==========================================


// ------------------------------------------
// Authentication
// ------------------------------------------

app.use(
  "/api/auth",
  authRoute
);


// ------------------------------------------
// AI Interview
// ------------------------------------------

app.use(
  "/api/interview",
  interviewRoute
);


// ------------------------------------------
// Employee Requests
// ------------------------------------------

app.use(
  "/api/employee",
  employeeRoute
);


// ------------------------------------------
// Meetings
// ------------------------------------------

app.use(
  "/api/meetings",
  meetingsRoute
);


// ==========================================
// Health Check
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

        employee:
          "/api/employee",

        meetings:
          "/api/meetings",

        myMeetings:
          "/api/meetings/my",

        uploads:
          "/uploads",
      },
    });
  }
);


// ==========================================
// API Test
// ==========================================

app.get(
  "/api/test",
  (req, res) => {

    res.json({

      success: true,

      message:
        "API is working correctly.",

    });
  }
);


// ==========================================
// 404 Handler
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
// Global Error Handler
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
// Start Server
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
      `Uploads: http://localhost:${PORT}/uploads`
    );

    console.log(
      `Meetings: http://localhost:${PORT}/api/meetings`
    );

    console.log(
      `My Meetings: http://localhost:${PORT}/api/meetings/my`
    );

    console.log(
      "=========================================="
    );
  }
);