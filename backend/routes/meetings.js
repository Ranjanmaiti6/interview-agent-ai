const express = require("express");

const {
  authenticateToken,
  requireRole,
} = require("../middleware/auth");

const db = require("../database");

const router = express.Router();


// ==========================================
// Create meetings table
// ==========================================

db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee_email TEXT NOT NULL,
    scheduled_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    meeting_url TEXT DEFAULT NULL,
    created_by TEXT DEFAULT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT NULL
  )
`);


// ==========================================
// CREATE MEETING
// Admin only
// POST /api/meetings
// ==========================================

router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {
      const {
        title,
        employeeEmail,
        scheduledAt,
        meetingUrl,
      } = req.body;


      // ========================================
      // Validation
      // ========================================

      if (
        !title ||
        !employeeEmail ||
        !scheduledAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, employee email and scheduled time are required.",
        });
      }


      const id =
        Date.now().toString();

      const createdAt =
        new Date().toISOString();


      // ========================================
      // Insert meeting
      // ========================================

      db.prepare(`
        INSERT INTO meetings (
          id,
          title,
          employee_email,
          scheduled_at,
          status,
          meeting_url,
          created_by,
          created_at
        )
        VALUES (
          @id,
          @title,
          @employeeEmail,
          @scheduledAt,
          'scheduled',
          @meetingUrl,
          @createdBy,
          @createdAt
        )
      `).run({
        id,

        title:
          title.trim(),

        employeeEmail:
          employeeEmail
            .trim()
            .toLowerCase(),

        scheduledAt,

        meetingUrl:
          meetingUrl || null,

        createdBy:
          req.user.email,

        createdAt,
      });


      // ========================================
      // Get created meeting
      // ========================================

      const meeting =
        db.prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `).get(id);


      return res.status(201).json({
        success: true,

        message:
          "Meeting created successfully.",

        meeting,
      });

    } catch (error) {

      console.error(
        "Create meeting error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to create meeting.",
      });
    }
  }
);


// ==========================================
// GET ALL MEETINGS
// Admin only
// GET /api/meetings
// ==========================================

router.get(
  "/",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {

      const meetings =
        db.prepare(`
          SELECT *
          FROM meetings
          ORDER BY scheduled_at ASC
        `).all();


      return res.json({
        success: true,

        meetings,
      });

    } catch (error) {

      console.error(
        "Get meetings error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load meetings.",
      });
    }
  }
);


// ==========================================
// GET MY MEETINGS
// Employee only
// GET /api/meetings/my
// ==========================================

router.get(
  "/my",
  authenticateToken,
  requireRole("employee"),
  (req, res) => {
    try {

      const employeeEmail =
        String(
          req.user.email || ""
        )
          .trim()
          .toLowerCase();


      if (!employeeEmail) {
        return res.status(400).json({
          success: false,

          message:
            "Employee email is missing from authentication.",
        });
      }


      const meetings =
        db.prepare(`
          SELECT *
          FROM meetings
          WHERE LOWER(employee_email) = ?
          ORDER BY scheduled_at ASC
        `).all(
          employeeEmail
        );


      return res.json({
        success: true,

        meetings,
      });

    } catch (error) {

      console.error(
        "Get employee meetings error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load your meetings.",
      });
    }
  }
);


// ==========================================
// GET SINGLE MEETING
// Admin only
// GET /api/meetings/:id
// ==========================================

router.get(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {

      const {
        id,
      } = req.params;


      const meeting =
        db.prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `).get(id);


      if (!meeting) {
        return res.status(404).json({
          success: false,

          message:
            "Meeting not found.",
        });
      }


      return res.json({
        success: true,

        meeting,
      });

    } catch (error) {

      console.error(
        "Get single meeting error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load meeting.",
      });
    }
  }
);


// ==========================================
// UPDATE MEETING
// Admin only
// PUT /api/meetings/:id
// ==========================================

router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {

      const {
        id,
      } = req.params;


      const {
        title,
        employeeEmail,
        scheduledAt,
        status,
        meetingUrl,
      } = req.body;


      const existing =
        db.prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `).get(id);


      if (!existing) {
        return res.status(404).json({
          success: false,

          message:
            "Meeting not found.",
        });
      }


      const updatedAt =
        new Date().toISOString();


      db.prepare(`
        UPDATE meetings
        SET
          title = ?,
          employee_email = ?,
          scheduled_at = ?,
          status = ?,
          meeting_url = ?,
          updated_at = ?
        WHERE id = ?
      `).run(

        title
          ? title.trim()
          : existing.title,

        employeeEmail
          ? employeeEmail
              .trim()
              .toLowerCase()
          : existing.employee_email,

        scheduledAt ||
          existing.scheduled_at,

        status ||
          existing.status,

        meetingUrl !== undefined
          ? meetingUrl
          : existing.meeting_url,

        updatedAt,

        id
      );


      const meeting =
        db.prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `).get(id);


      return res.json({
        success: true,

        message:
          "Meeting updated successfully.",

        meeting,
      });

    } catch (error) {

      console.error(
        "Update meeting error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to update meeting.",
      });
    }
  }
);


// ==========================================
// DELETE MEETING
// Admin only
// DELETE /api/meetings/:id
// ==========================================

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {

      const {
        id,
      } = req.params;


      const result =
        db.prepare(`
          DELETE FROM meetings
          WHERE id = ?
        `).run(id);


      if (result.changes === 0) {
        return res.status(404).json({
          success: false,

          message:
            "Meeting not found.",
        });
      }


      return res.json({
        success: true,

        message:
          "Meeting deleted successfully.",
      });

    } catch (error) {

      console.error(
        "Delete meeting error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to delete meeting.",
      });
    }
  }
);


module.exports = router;