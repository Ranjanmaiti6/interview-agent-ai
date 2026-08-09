const express = require("express");

const db = require("../database");

const router = express.Router();

// ==========================================
// Helpers
// ==========================================

function parseArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed =
      JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function formatReport(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,

    candidateId:
      row.candidate_id,

    employeeRequestId:
      row.employee_request_id,

    candidateName:
      row.candidate_name,

    candidateEmail:
      row.candidate_email,

    meetingId:
      row.meeting_id,

    summary:
      row.summary || "",

    strengths:
      parseArray(
        row.strengths
      ),

    gaps:
      parseArray(
        row.gaps
      ),

    next:
      parseArray(
        row.next_steps
      ),

    nextSteps:
      parseArray(
        row.next_steps
      ),

    score: {
      technical:
        Number(
          row.technical_score || 0
        ),

      communication:
        Number(
          row.communication_score || 0
        ),

      problemSolving:
        Number(
          row.problem_solving_score || 0
        ),

      overall:
        Number(
          row.overall_score || 0
        ),
    },

    technicalScore:
      Number(
        row.technical_score || 0
      ),

    communicationScore:
      Number(
        row.communication_score || 0
      ),

    problemSolvingScore:
      Number(
        row.problem_solving_score || 0
      ),

    overallScore:
      Number(
        row.overall_score || 0
      ),

    recommendation:
      row.recommendation || "",

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

// ==========================================
// GET REPORT BY MEETING
//
// GET /api/reports/meeting/:meetingId
// ==========================================

router.get(
  "/meeting/:meetingId",
  (req, res) => {
    try {
      const {
        meetingId,
      } = req.params;

      if (
        !meetingId ||
        meetingId === "undefined"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting ID is required.",
          report: null,
        });
      }

      const row =
        db.prepare(`
          SELECT *
          FROM interview_reports
          WHERE meeting_id = ?
          ORDER BY created_at DESC
          LIMIT 1
        `).get(meetingId);

      return res.status(200).json({
        success: true,

        report:
          formatReport(row),
      });
    } catch (error) {
      console.error(
        "Load meeting report error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load meeting report.",

        report: null,
      });
    }
  }
);

// ==========================================
// GET LATEST REPORT
// ==========================================

router.get(
  "/latest",
  (req, res) => {
    try {
      const row =
        db.prepare(`
          SELECT *
          FROM interview_reports
          ORDER BY created_at DESC
          LIMIT 1
        `).get();

      const report =
        formatReport(row);

      return res.status(200).json({
        success: true,

        report,

        data: report,
      });
    } catch (error) {
      console.error(
        "Load latest report error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load latest report.",

        report: null,
      });
    }
  }
);

// ==========================================
// GET ALL REPORTS
// ==========================================

router.get(
  "/",
  (req, res) => {
    try {
      const rows =
        db.prepare(`
          SELECT *
          FROM interview_reports
          ORDER BY created_at DESC
        `).all();

      const reports =
        rows.map(formatReport);

      return res.status(200).json({
        success: true,

        reports,

        count:
          reports.length,
      });
    } catch (error) {
      console.error(
        "Load reports error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load reports.",

        reports: [],
      });
    }
  }
);

// ==========================================
// GET REPORT BY ID
// ==========================================

router.get(
  "/:id",
  (req, res) => {
    try {
      const row =
        db.prepare(`
          SELECT *
          FROM interview_reports
          WHERE id = ?
          LIMIT 1
        `).get(
          req.params.id
        );

      if (!row) {
        return res.status(404).json({
          success: false,

          message:
            "Report not found.",

          report: null,
        });
      }

      return res.status(200).json({
        success: true,

        report:
          formatReport(row),
      });
    } catch (error) {
      console.error(
        "Load report error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load report.",
      });
    }
  }
);

// ==========================================
// POST REPORT
//
// Kept for compatibility with your existing
// frontend or other services.
// ==========================================

router.post(
  "/",
  (req, res) => {
    try {
      const {
        candidateId,
        employeeRequestId,
        candidateName,
        candidateEmail,
        meetingId,
        summary,
        strengths,
        gaps,
        next,
        nextSteps,
        score,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        overallScore,
        recommendation,
      } = req.body;

      const technical =
        Number(
          technicalScore ??
          score?.technical ??
          0
        );

      const communication =
        Number(
          communicationScore ??
          score?.communication ??
          0
        );

      const problemSolving =
        Number(
          problemSolvingScore ??
          score?.problemSolving ??
          0
        );

      const calculatedOverall =
        Number(
          overallScore ??
          score?.overall ??
          (
            (
              technical +
              communication +
              problemSolving
            ) / 3
          ).toFixed(2)
        );

      const strengthsArray =
        Array.isArray(strengths)
          ? strengths
          : [];

      const gapsArray =
        Array.isArray(gaps)
          ? gaps
          : [];

      const nextArray =
        Array.isArray(nextSteps)
          ? nextSteps
          : Array.isArray(next)
            ? next
            : [];

      const now =
        new Date().toISOString();

      // --------------------------------------
      // If a meeting already has a report,
      // update it instead of creating endless
      // duplicate reports.
      // --------------------------------------

      let existing = null;

      if (meetingId) {
        existing =
          db.prepare(`
            SELECT *
            FROM interview_reports
            WHERE meeting_id = ?
            ORDER BY created_at DESC
            LIMIT 1
          `).get(meetingId);
      }

      if (existing) {
        db.prepare(`
          UPDATE interview_reports
          SET
            candidate_id = ?,
            employee_request_id = ?,
            candidate_name = ?,
            candidate_email = ?,
            summary = ?,
            strengths = ?,
            gaps = ?,
            next_steps = ?,
            technical_score = ?,
            communication_score = ?,
            problem_solving_score = ?,
            overall_score = ?,
            recommendation = ?,
            updated_at = ?
          WHERE id = ?
        `).run(
          candidateId || null,
          employeeRequestId || null,
          candidateName || null,
          candidateEmail || null,
          summary || "",
          JSON.stringify(
            strengthsArray
          ),
          JSON.stringify(
            gapsArray
          ),
          JSON.stringify(
            nextArray
          ),
          technical,
          communication,
          problemSolving,
          calculatedOverall,
          recommendation || "",
          now,
          existing.id
        );

        const row =
          db.prepare(`
            SELECT *
            FROM interview_reports
            WHERE id = ?
          `).get(existing.id);

        return res.status(200).json({
          success: true,

          message:
            "Interview report updated successfully.",

          report:
            formatReport(row),
        });
      }

      // --------------------------------------
      // Create
      // --------------------------------------

      const id =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}`;

      db.prepare(`
        INSERT INTO interview_reports (
          id,
          candidate_id,
          employee_request_id,
          candidate_name,
          candidate_email,
          meeting_id,
          summary,
          strengths,
          gaps,
          next_steps,
          technical_score,
          communication_score,
          problem_solving_score,
          overall_score,
          recommendation,
          created_at,
          updated_at
        )
        VALUES (
          @id,
          @candidateId,
          @employeeRequestId,
          @candidateName,
          @candidateEmail,
          @meetingId,
          @summary,
          @strengths,
          @gaps,
          @nextSteps,
          @technicalScore,
          @communicationScore,
          @problemSolvingScore,
          @overallScore,
          @recommendation,
          @createdAt,
          @updatedAt
        )
      `).run({
        id,

        candidateId:
          candidateId || null,

        employeeRequestId:
          employeeRequestId || null,

        candidateName:
          candidateName || null,

        candidateEmail:
          candidateEmail || null,

        meetingId:
          meetingId || null,

        summary:
          summary || "",

        strengths:
          JSON.stringify(
            strengthsArray
          ),

        gaps:
          JSON.stringify(
            gapsArray
          ),

        nextSteps:
          JSON.stringify(
            nextArray
          ),

        technicalScore:
          technical,

        communicationScore:
          communication,

        problemSolvingScore:
          problemSolving,

        overallScore:
          calculatedOverall,

        recommendation:
          recommendation || "",

        createdAt: now,

        updatedAt: now,
      });

      // --------------------------------------
      // Update candidate AI score
      // --------------------------------------

      if (employeeRequestId) {
        try {
          db.prepare(`
            UPDATE employee_requests
            SET
              ai_score = ?,
              updated_at = ?
            WHERE id = ?
          `).run(
            calculatedOverall,
            now,
            employeeRequestId
          );
        } catch (error) {
          console.error(
            "Unable to update employee AI score:",
            error
          );
        }
      }

      const row =
        db.prepare(`
          SELECT *
          FROM interview_reports
          WHERE id = ?
        `).get(id);

      return res.status(201).json({
        success: true,

        message:
          "Interview report created successfully.",

        report:
          formatReport(row),
      });
    } catch (error) {
      console.error(
        "Create report error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to create interview report.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);

module.exports = router;