const express = require("express");

const {
  authenticateToken,
  requireRole,
} = require("../middleware/auth");

const db = require("../database");

const router = express.Router();

// ==========================================
// Meetings table
// ==========================================

db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY,

    employee_request_id TEXT DEFAULT NULL,

    employee_name TEXT DEFAULT NULL,

    employee_email TEXT NOT NULL,

    title TEXT NOT NULL,

    description TEXT DEFAULT NULL,

    scheduled_at TEXT NOT NULL,

    duration_minutes INTEGER NOT NULL DEFAULT 30,

    status TEXT NOT NULL DEFAULT 'scheduled',

    meeting_type TEXT NOT NULL DEFAULT 'human',

    meeting_url TEXT DEFAULT NULL,

    created_by TEXT DEFAULT NULL,

    created_at TEXT NOT NULL,

    updated_at TEXT DEFAULT NULL
  )
`);

// ==========================================
// Database migration
// ==========================================
//
// Existing database files were created before
// meeting_type existed.
//
// Add the column if it does not already exist.
// ==========================================

try {
  const columns = db
    .prepare(`PRAGMA table_info(meetings)`)
    .all();

  const hasMeetingType = columns.some(
    (column) => column.name === "meeting_type"
  );

  if (!hasMeetingType) {
    db.exec(`
      ALTER TABLE meetings
      ADD COLUMN meeting_type TEXT NOT NULL DEFAULT 'human'
    `);

    console.log(
      "Migration: meeting_type added to meetings."
    );
  }
} catch (migrationError) {
  console.error(
    "Meeting type migration error:",
    migrationError
  );
}

// ==========================================
// Normalize meeting type
// ==========================================

function normalizeMeetingType(value) {
  const type = String(
    value || "human"
  )
    .trim()
    .toLowerCase();

  if (
    type === "ai" ||
    type === "ai_interview"
  ) {
    return "ai";
  }

  return "human";
}

// ==========================================
// GET ALL MEETINGS
// Admin only
//
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
          SELECT *
          FROM meetings
          ORDER BY scheduled_at ASC
        `)
        .all();

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
        message: "Unable to load meetings.",
      });
    }
  }
);

// ==========================================
// GET MY MEETINGS
// Employee only
//
// GET /api/meetings/my
// ==========================================

router.get(
  "/my",
  authenticateToken,
  requireRole("employee"),
  (req, res) => {
    try {
      const email = String(
        req.user?.email || ""
      )
        .trim()
        .toLowerCase();

      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Employee email is missing.",
        });
      }

      const meetings = db
        .prepare(`
          SELECT *
          FROM meetings
          WHERE LOWER(employee_email) = ?
          ORDER BY scheduled_at ASC
        `)
        .all(email);

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
//
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
        meetingType,
      } = req.body;

      // --------------------------------------
      // Validate required fields
      // --------------------------------------

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

      const cleanTitle = String(
        title
      ).trim();

      const cleanName = employeeName
        ? String(employeeName).trim()
        : "Employee";

      if (!cleanEmail) {
        return res.status(400).json({
          success: false,
          message:
            "Employee email is required.",
        });
      }

      if (!cleanTitle) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting title is required.",
        });
      }

      // --------------------------------------
      // Validate date
      // --------------------------------------

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
            "Invalid scheduled date.",
        });
      }

      // --------------------------------------
      // Duration
      // --------------------------------------

      const parsedDuration =
        Number(durationMinutes);

      const duration =
        Number.isFinite(
          parsedDuration
        ) &&
        parsedDuration > 0
          ? parsedDuration
          : 30;

      // --------------------------------------
      // Meeting type
      // --------------------------------------

      const cleanMeetingType =
        normalizeMeetingType(
          meetingType
        );

      // --------------------------------------
      // ID
      // --------------------------------------

      const id =
        `${Date.now()}-${Math.round(
          Math.random() * 100000
        )}`;

      const createdAt =
        new Date().toISOString();

      // --------------------------------------
      // Human meetings should not
      // accidentally become AI interviews.
      //
      // If meetingType is human, we keep it
      // explicitly human.
      // --------------------------------------

      const cleanMeetingUrl =
        meetingUrl
          ? String(meetingUrl).trim()
          : null;

      // --------------------------------------
      // Insert
      // --------------------------------------

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
          meeting_type,
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
          @meetingType,
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

        meetingType:
          cleanMeetingType,

        meetingUrl:
          cleanMeetingUrl,

        createdBy:
          req.user?.email || null,

        createdAt,
      });

      // --------------------------------------
      // Get created meeting
      // --------------------------------------

      const meeting = db
        .prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `)
        .get(id);

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
// GET SINGLE MEETING
//
// Admin OR owning employee
//
// GET /api/meetings/:id
// ==========================================

router.get(
  "/:id",
  authenticateToken,
  (req, res) => {
    try {
      const { id } = req.params;

      if (
        !id ||
        id === "undefined"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting ID is required.",
        });
      }

      const meeting = db
        .prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `)
        .get(id);

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message:
            "Meeting not found.",
        });
      }

      // --------------------------------------
      // Admin
      // --------------------------------------

      if (
        req.user?.role ===
        "admin"
      ) {
        return res.json({
          success: true,
          meeting,
        });
      }

      // --------------------------------------
      // Employee
      // --------------------------------------

      if (
        req.user?.role ===
        "employee"
      ) {
        const loggedInEmail =
          String(
            req.user?.email || ""
          )
            .trim()
            .toLowerCase();

        const meetingEmail =
          String(
            meeting.employee_email ||
              ""
          )
            .trim()
            .toLowerCase();

        if (
          !loggedInEmail ||
          loggedInEmail !==
            meetingEmail
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
        message:
          "Access denied.",
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
//
// PUT /api/meetings/:id
// ==========================================

router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !id ||
        id === "undefined"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting ID is required.",
        });
      }

      const existing = db
        .prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `)
        .get(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Meeting not found.",
        });
      }

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
        meetingType,
      } = req.body;

      // --------------------------------------
      // Status
      // --------------------------------------

      const allowedStatuses = [
        "scheduled",
        "completed",
        "cancelled",
      ];

      const nextStatus =
        status !== undefined &&
        status !== null &&
        String(status).trim()
          ? String(status)
              .trim()
              .toLowerCase()
          : existing.status;

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

      // --------------------------------------
      // Scheduled date
      // --------------------------------------

      let nextScheduledAt =
        existing.scheduled_at;

      if (
        scheduledAt !==
        undefined
      ) {
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
              "Invalid scheduled date.",
          });
        }

        nextScheduledAt =
          date.toISOString();
      }

      // --------------------------------------
      // Employee email
      // --------------------------------------

      const nextEmail =
        employeeEmail !==
        undefined
          ? String(employeeEmail)
              .trim()
              .toLowerCase()
          : existing.employee_email;

      if (!nextEmail) {
        return res.status(400).json({
          success: false,
          message:
            "Employee email is required.",
        });
      }

      // --------------------------------------
      // Employee name
      // --------------------------------------

      const nextName =
        employeeName !==
        undefined
          ? String(
              employeeName
            ).trim()
          : existing.employee_name;

      // --------------------------------------
      // Title
      // --------------------------------------

      const nextTitle =
        title !== undefined
          ? String(title).trim()
          : existing.title;

      if (!nextTitle) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting title is required.",
        });
      }

      // --------------------------------------
      // Description
      // --------------------------------------

      const nextDescription =
        description !==
        undefined
          ? description
            ? String(
                description
              ).trim()
            : null
          : existing.description;

      // --------------------------------------
      // Duration
      // --------------------------------------

      const parsedDuration =
        Number(durationMinutes);

      const nextDuration =
        durationMinutes !==
          undefined &&
        Number.isFinite(
          parsedDuration
        ) &&
        parsedDuration > 0
          ? parsedDuration
          : existing.duration_minutes;

      // --------------------------------------
      // Meeting URL
      // --------------------------------------

      const nextMeetingUrl =
        meetingUrl !==
        undefined
          ? meetingUrl
            ? String(
                meetingUrl
              ).trim()
            : null
          : existing.meeting_url;

      // --------------------------------------
      // Meeting type
      // --------------------------------------

      const nextMeetingType =
        meetingType !==
        undefined
          ? normalizeMeetingType(
              meetingType
            )
          : normalizeMeetingType(
              existing.meeting_type
            );

      // --------------------------------------
      // Employee request ID
      // --------------------------------------

      const nextEmployeeRequestId =
        employeeRequestId !==
        undefined
          ? employeeRequestId ||
            null
          : existing.employee_request_id;

      const updatedAt =
        new Date().toISOString();

      // --------------------------------------
      // Update
      // --------------------------------------

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
          meeting_type = ?,
          meeting_url = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        nextEmployeeRequestId,
        nextName,
        nextEmail,
        nextTitle,
        nextDescription,
        nextScheduledAt,
        nextDuration,
        nextStatus,
        nextMeetingType,
        nextMeetingUrl,
        updatedAt,
        id
      );

      const meeting = db
        .prepare(`
          SELECT *
          FROM meetings
          WHERE id = ?
        `)
        .get(id);

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
//
// DELETE /api/meetings/:id
// ==========================================

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !id ||
        id === "undefined"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting ID is required.",
        });
      }

      const result = db
        .prepare(`
          DELETE FROM meetings
          WHERE id = ?
        `)
        .run(id);

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