const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();


// ==========================================
// Resume upload configuration
// ==========================================

const uploadDirectory = path.join(
  __dirname,
  "../uploads/resumes"
);

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension =
      path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});


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

    const extension =
      path.extname(
        file.originalname
      ).toLowerCase();

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
// Temporary in-memory storage
// ==========================================

const employeeRequests = [];


// ==========================================
// Submit employee interview request
// ==========================================

router.post(
  "/request",
  upload.single("resume"),
  (req, res) => {
    try {

      const {
        name,
        email,
      } = req.body;


      // ========================================
      // Validate employee information
      // ========================================

      if (!name || !email) {

        // Delete uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          );
        }

        return res.status(400).json({
          success: false,

          message:
            "Name and email are required.",
        });
      }


      // ========================================
      // Validate resume
      // ========================================

      if (!req.file) {

        return res.status(400).json({
          success: false,

          message:
            "Resume is required.",
        });
      }


      // ========================================
      // Check existing pending request
      // ========================================

      const existingRequest =
        employeeRequests.find(
          (request) =>
            request.email === email &&
            request.status === "pending"
        );


      if (existingRequest) {

        // Remove newly uploaded resume
        fs.unlinkSync(
          req.file.path
        );

        return res.status(409).json({
          success: false,

          message:
            "You already have a pending interview request.",
        });
      }


      // ========================================
      // Create request
      // ========================================

      const request = {

        id:
          Date.now().toString(),

        name,

        email,

        status: "pending",

        aiScore: null,

        resume: {
          originalName:
            req.file.originalname,

          filename:
            req.file.filename,

          path:
            `/uploads/resumes/${req.file.filename}`,

          size:
            req.file.size,

          uploadedAt:
            new Date().toISOString(),
        },

        createdAt:
          new Date().toISOString(),

        updatedAt: null,
      };


      employeeRequests.push(
        request
      );


      console.log(
        "New employee interview request:",
        request
      );


      // ========================================
      // Response
      // ========================================

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


      // Delete uploaded file if something fails
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
          "Unable to submit interview request.",
      });
    }
  }
);


// ==========================================
// Get all employee requests
// ==========================================

router.get(
  "/requests",
  (req, res) => {

    try {

      return res.json({

        success: true,

        requests:
          employeeRequests,

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
// Accept / Reject employee request
// ==========================================

router.put(
  "/requests/:id",
  (req, res) => {

    try {

      const { id } =
        req.params;

      const { status } =
        req.body;


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


      const request =
        employeeRequests.find(
          (item) =>
            item.id === id
        );


      if (!request) {

        return res.status(404).json({

          success: false,

          message:
            "Employee request not found.",

        });
      }


      request.status =
        status;

      request.updatedAt =
        new Date().toISOString();


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
// Get single employee request
// ==========================================

router.get(
  "/requests/:id",
  (req, res) => {

    try {

      const { id } =
        req.params;

      const request =
        employeeRequests.find(
          (item) =>
            item.id === id
        );


      if (!request) {

        return res.status(404).json({

          success: false,

          message:
            "Employee request not found.",

        });
      }


      return res.json({

        success: true,

        request,

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