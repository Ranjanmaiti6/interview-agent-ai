const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../database");

const {
  authenticateToken,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

// ==========================================
// Resume upload configuration
// ==========================================

const uploadDirectory = path.join(
  __dirname,
  "../uploads/resumes"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ==========================================
// Multer storage
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// ==========================================
// Multer upload
// ==========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
    ];

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (
      allowedExtensions.includes(
        extension
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, DOC and DOCX files are allowed."
        )
      );
    }
  },
});

// ==========================================
// Helper: convert database row
// ==========================================

function formatRequest(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,

    name: row.name,

    email: row.email,

    status: row.status,

    aiScore: row.ai_score,

    resume: row.resume_filename
      ? {
          originalName:
            row.resume_original_name,

          filename:
            row.resume_filename,

          path:
            row.resume_path,

          url:
            row.resume_url,

          size:
            row.resume_size,

          uploadedAt:
            row.resume_uploaded_at,
        }
      : null,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

// ==========================================
// Submit employee interview request
// ==========================================
// EMPLOYEE ONLY
// ==========================================

router.post(
  "/request",
  authenticateToken,
  requireRole("employee"),
  upload.single("resume"),
  (req, res) => {
    try {
      const {
        name,
        email,
      } = req.body;

      // ======================================
      // Validate name/email
      // ======================================

      if (!name || !email) {
        if (req.file) {
          try {
            fs.unlinkSync(
              req.file.path
            );
          } catch (error) {
            console.error(
              "Unable to remove file:",
              error
            );
          }
        }

        return res.status(400).json({
          success: false,
          message:
            "Name and email are required.",
        });
      }

      // ======================================
      // Validate resume
      // ======================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Resume is required.",
        });
      }

      // ======================================
      // Normalize email
      // ======================================

      const normalizedEmail =
        email.trim().toLowerCase();

      // ======================================
      // Check duplicate pending request
      // ======================================

      const existingRequest =
        db.prepare(`
          SELECT *
          FROM employee_requests
          WHERE email = ?
          AND status = 'pending'
          LIMIT 1
        `).get(normalizedEmail);

      if (existingRequest) {
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch (error) {
          console.error(
            "Unable to remove duplicate resume:",
            error
          );
        }

        return res.status(409).json({
          success: false,
          message:
            "You already have a pending interview request.",
        });
      }

      // ======================================
      // Backend URL
      // ======================================

      const backendUrl =
        process.env.BACKEND_URL ||
        `http://localhost:${
          process.env.PORT || 5001
        }`;

      // ======================================
      // Create request
      // ======================================

      const id =
        Date.now().toString();

      const createdAt =
        new Date().toISOString();

      const request = {
        id,

        name: name.trim(),

        email: normalizedEmail,

        status: "pending",

        aiScore: null,

        resume: {
          originalName:
            req.file.originalname,

          filename:
            req.file.filename,

          path:
            `/uploads/resumes/${req.file.filename}`,

          url:
            `${backendUrl}/uploads/resumes/${req.file.filename}`,

          size:
            req.file.size,

          uploadedAt:
            createdAt,
        },

        createdAt,

        updatedAt: null,
      };

      // ======================================
      // Save to SQLite
      // ======================================

      db.prepare(`
        INSERT INTO employee_requests (
          id,
          name,
          email,
          status,
          ai_score,

          resume_original_name,
          resume_filename,
          resume_path,
          resume_url,
          resume_size,
          resume_uploaded_at,

          created_at,
          updated_at
        )
        VALUES (
          @id,
          @name,
          @email,
          @status,
          @aiScore,

          @resumeOriginalName,
          @resumeFilename,
          @resumePath,
          @resumeUrl,
          @resumeSize,
          @resumeUploadedAt,

          @createdAt,
          @updatedAt
        )
      `).run({
        id: request.id,

        name: request.name,

        email: request.email,

        status: request.status,

        aiScore: request.aiScore,

        resumeOriginalName:
          request.resume.originalName,

        resumeFilename:
          request.resume.filename,

        resumePath:
          request.resume.path,

        resumeUrl:
          request.resume.url,

        resumeSize:
          request.resume.size,

        resumeUploadedAt:
          request.resume.uploadedAt,

        createdAt:
          request.createdAt,

        updatedAt:
          request.updatedAt,
      });

      console.log(
        "New employee interview request:",
        request
      );

      // ======================================
      // Response
      // ======================================

      return res.status(201).json({
        success: true,

        message:
          "Interview request submitted successfully.",

        request,
      });

    } catch (error) {
      console.error(
        "Employee request error:",
        error
      );

      if (req.file) {
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch (deleteError) {
          console.error(
            "Unable to remove uploaded file:",
            deleteError
          );
        }
      }

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to submit employee request.",
      });
    }
  }
);

// ==========================================
// Get all employee requests
// ==========================================
// ADMIN ONLY
// ==========================================

router.get(
  "/requests",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {
      const rows =
        db.prepare(`
          SELECT *
          FROM employee_requests
          ORDER BY created_at DESC
        `).all();

      const requests =
        rows.map(formatRequest);

      return res.json({
        success: true,
        requests,
      });

    } catch (error) {
      console.error(
        "Get requests error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load employee requests.",
      });
    }
  }
);

// ==========================================
// Accept / Reject request
// ==========================================
// ADMIN ONLY
// ==========================================

router.put(
  "/requests/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      // ======================================
      // Validate status
      // ======================================

      if (
        status !== "accepted" &&
        status !== "rejected"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Status must be accepted or rejected.",
        });
      }

      // ======================================
      // Find request
      // ======================================

      const existingRequest =
        db.prepare(`
          SELECT *
          FROM employee_requests
          WHERE id = ?
          LIMIT 1
        `).get(id);

      if (!existingRequest) {
        return res.status(404).json({
          success: false,

          message:
            "Employee request not found.",
        });
      }

      // ======================================
      // Update request
      // ======================================

      const updatedAt =
        new Date().toISOString();

      db.prepare(`
        UPDATE employee_requests
        SET
          status = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        status,
        updatedAt,
        id
      );

      const updatedRow =
        db.prepare(`
          SELECT *
          FROM employee_requests
          WHERE id = ?
          LIMIT 1
        `).get(id);

      const request =
        formatRequest(updatedRow);

      console.log(
        `Employee request ${id} updated to ${status}`
      );

      return res.json({
        success: true,

        message:
          `Request ${status} successfully.`,

        request,
      });

    } catch (error) {
      console.error(
        "Update request error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to update employee request.",
      });
    }
  }
);

// ==========================================
// Get single request
// ==========================================
// ADMIN ONLY
// ==========================================

router.get(
  "/requests/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {
      const { id } =
        req.params;

      const row =
        db.prepare(`
          SELECT *
          FROM employee_requests
          WHERE id = ?
          LIMIT 1
        `).get(id);

      if (!row) {
        return res.status(404).json({
          success: false,

          message:
            "Employee request not found.",
        });
      }

      return res.json({
        success: true,

        request:
          formatRequest(row),
      });

    } catch (error) {
      console.error(
        "Get single request error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load employee request.",
      });
    }
  }
);

module.exports = router;