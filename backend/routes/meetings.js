const express = require("express");

const {
  authenticateToken,
  requireRole,
} = require("../middleware/auth");

const db = require("../database");

const router = express.Router();

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
      const meetings = db
        .prepare(`
          SELECT
            id,
            employee_request_id,
            employee_name,
            employee_email,
            title,
            description,
            scheduled_at,
            duration_minutes,
            status,
            meeting_url,
            created_by,
            created_at,
            updated_at
          FROM meetings
          ORDER BY scheduled_at ASC
        `)
        .all();

      return res.json({
        success: true,
        meetings,
      });

    } catch (error) {
      console.error("Get meetings error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to load meetings.",
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
      const employeeEmail = String(
        req.user?.email || ""
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

      const meetings = db
        .prepare(`
          SELECT
            id,
            employee_request_id,
            employee_name,
            employee_email,
            title,
            description,
            scheduled_at,
            duration_minutes,
            status,
            meeting_url,
            created_by,
            created_at,
            updated_at
          FROM meetings
          WHERE LOWER(employee_email) = ?
          ORDER BY scheduled_at ASC
        `)
        .all(employeeEmail);

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
        employeeRequestId,
        employeeName,
        employeeEmail,
        title,
        description,
        scheduledAt,
        durationMinutes,
        meetingUrl,
      } = req.body;

      if (
        !employeeEmail ||
        !title ||
        !scheduledAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Employee email, title and scheduled time are required.",
        });
      }

      const cleanEmail = String(
        employeeEmail
      )
        .trim()
        .toLowerCase();

      const cleanTitle =
        String(title).trim();

      const cleanName = employeeName
        ? String(employeeName).trim()
        : "Employee";

      const scheduledDate =
        new Date(scheduledAt);

      if (
        Number.isNaN(
          scheduledDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid scheduled date and time.",
        });
      }

      const duration =
        Number(durationMinutes) > 0
          ? Number(durationMinutes)
          : 30;

      const id =
        `${Date.now()}-${Math.round(
          Math.random() * 1000000
        )}`;

      const createdAt =
        new Date().toISOString();

      db.prepare(`
        INSERT INTO meetings (
          id,
          employee_request_id,
          employee_name,
          employee_email,
          title,
          description,
          scheduled_at,
          duration_minutes,
          status,
          meeting_url,
          created_by,
          created_at,
          updated_at
        )
        VALUES (
          @id,
          @employeeRequestId,
          @employeeName,
          @employeeEmail,
          @title,
          @description,
          @scheduledAt,
          @durationMinutes,
          'scheduled',
          @meetingUrl,
          @createdBy,
          @createdAt,
          NULL
        )
      `).run({
        id,

        employeeRequestId:
          employeeRequestId || null,

        employeeName:
          cleanName,

        employeeEmail:
          cleanEmail,

        title:
          cleanTitle,

        description:
          description
            ? String(description).trim()
            : null,

        scheduledAt:
          scheduledDate.toISOString(),

        durationMinutes:
          duration,

        meetingUrl:
          meetingUrl
            ? String(meetingUrl).trim()
            : null,

        createdBy:
          req.user.email,

        createdAt,
      });

      const meeting =
        db.prepare(`
          SELECT
            id,
            employee_request_id,
            employee_name,
            employee_email,
            title,
            description,
            scheduled_at,
            duration_minutes,
            status,
            meeting_url,
            created_by,
            created_at,
            updated_at
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
          error.message ||
          "Unable to create meeting.",
      });
    }
  }
);

// ==========================================
// GET SINGLE MEETING
// Admin OR owning employee
// GET /api/meetings/:id
// ==========================================

router.get(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const meeting =
        db.prepare(`
          SELECT
            id,
            employee_request_id,
            employee_name,
            employee_email,
            title,
            description,
            scheduled_at,
            duration_minutes,
            status,
            meeting_url,
            created_by,
            created_at,
            updated_at
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

      // ========================================
      // Admin can access any meeting
      // ========================================

      if (req.user?.role === "admin") {
        return res.json({
          success: true,
          meeting,
        });
      }

      // ========================================
      // Employee can only access own meeting
      // ========================================

      if (req.user?.role === "employee") {
        const loggedInEmail =
          String(
            req.user?.email || ""
          )
            .trim()
            .toLowerCase();

        const meetingEmail =
          String(
            meeting.employee_email || ""
          )
            .trim()
            .toLowerCase();

        if (
          !loggedInEmail ||
          loggedInEmail !== meetingEmail
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You are not allowed to access this meeting.",
          });
        }

        return res.json({
          success: true,
          meeting,
        });
      }

      return res.status(403).json({
        success: false,
        message: "Access denied.",
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
      const { id } = req.params;

      const {
        employeeRequestId,
        employeeName,
        employeeEmail,
        title,
        description,
        scheduledAt,
        durationMinutes,
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

      const allowedStatuses = [
        "scheduled",
        "completed",
        "cancelled",
      ];

      const nextStatus =
        status || existing.status;

      if (
        !allowedStatuses.includes(
          nextStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid meeting status.",
        });
      }

      let nextScheduledAt =
        existing.scheduled_at;

      if (scheduledAt) {
        const date =
          new Date(scheduledAt);

        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid scheduled date and time.",
          });
        }

        nextScheduledAt =
          date.toISOString();
      }

      const nextEmail =
        employeeEmail
          ? String(employeeEmail)
              .trim()
              .toLowerCase()
          : existing.employee_email;

      const nextName =
        employeeName !== undefined
          ? String(employeeName).trim()
          : existing.employee_name;

      const nextTitle =
        title !== undefined
          ? String(title).trim()
          : existing.title;

      const nextDescription =
        description !== undefined
          ? String(description).trim()
          : existing.description;

      const nextDuration =
        durationMinutes !== undefined
          ? Number(durationMinutes)
          : existing.duration_minutes;

      const nextMeetingUrl =
        meetingUrl !== undefined
          ? meetingUrl
            ? String(meetingUrl).trim()
            : null
          : existing.meeting_url;

      const updatedAt =
        new Date().toISOString();

      db.prepare(`
        UPDATE meetings
        SET
          employee_request_id = ?,
          employee_name = ?,
          employee_email = ?,
          title = ?,
          description = ?,
          scheduled_at = ?,
          duration_minutes = ?,
          status = ?,
          meeting_url = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        employeeRequestId !== undefined
          ? employeeRequestId
          : existing.employee_request_id,

        nextName,
        nextEmail,
        nextTitle,
        nextDescription,
        nextScheduledAt,
        nextDuration,
        nextStatus,
        nextMeetingUrl,
        updatedAt,
        id
      );

      const meeting =
        db.prepare(`
          SELECT
            id,
            employee_request_id,
            employee_name,
            employee_email,
            title,
            description,
            scheduled_at,
            duration_minutes,
            status,
            meeting_url,
            created_by,
            created_at,
            updated_at
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
          error.message ||
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
      const { id } = req.params;

      const result =
        db.prepare(`
          DELETE FROM meetings
          WHERE id = ?
        `).run(id);

      if (
        result.changes === 0
      ) {
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