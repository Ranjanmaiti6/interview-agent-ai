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
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(
    0,
    Math.min(100, number)
  );
}

function formatQuestions(value) {
  const questions = parseArray(value);

  return questions.map((item, index) => ({
    id:
      item.id ||
      item.questionId ||
      index + 1,

    questionId:
      item.questionId ||
      item.id ||
      index + 1,

    category:
      item.category ||
      "Interview",

    question:
      item.question ||
      item.questionText ||
      `Question ${index + 1}`,

    answer:
      item.answer ||
      item.response ||
      "No answer recorded.",

    score: safeNumber(
      item.score ??
        item.questionScore ??
        0
    ),

    feedback:
      item.feedback ||
      item.evaluation ||
      "No detailed feedback was provided.",
  }));
}

// ==========================================
// Format database report
// ==========================================

function formatReport(row) {
  if (!row) {
    return null;
  }

  const strengths = parseArray(
    row.strengths
  );

  const gaps = parseArray(
    row.gaps
  );

  const nextSteps = parseArray(
    row.next_steps
  );

  const questions = formatQuestions(
    row.questions
  );

  return {
    id: row.id,

    candidateId:
      row.candidate_id || null,

    employeeRequestId:
      row.employee_request_id || null,

    candidateName:
      row.candidate_name ||
      "Candidate",

    candidateEmail:
      row.candidate_email ||
      "",

    meetingId:
      row.meeting_id || null,

    position:
      row.position ||
      "Technical Interview",

    summary:
      row.summary || "",

    // --------------------------------------
    // Strengths
    // --------------------------------------

    strengths,

    // --------------------------------------
    // Gaps / weaknesses
    // --------------------------------------

    gaps,

    weaknesses: gaps,

    // --------------------------------------
    // Next steps
    // --------------------------------------

    next: nextSteps,

    nextSteps,

    // --------------------------------------
    // Score object
    // --------------------------------------

    score: {
      technical: safeNumber(
        row.technical_score
      ),

      communication: safeNumber(
        row.communication_score
      ),

      problemSolving: safeNumber(
        row.problem_solving_score
      ),

      experience: safeNumber(
        row.experience_score
      ),

      overall: safeNumber(
        row.overall_score
      ),
    },

    // --------------------------------------
    // Individual scores
    // --------------------------------------

    technicalScore: safeNumber(
      row.technical_score
    ),

    communicationScore: safeNumber(
      row.communication_score
    ),

    problemSolvingScore: safeNumber(
      row.problem_solving_score
    ),

    experienceScore: safeNumber(
      row.experience_score
    ),

    overallScore: safeNumber(
      row.overall_score
    ),

    // --------------------------------------
    // Recommendation
    // --------------------------------------

    recommendation:
      row.recommendation ||
      "Under Review",

    status:
      row.status ||
      "completed",

    durationMinutes:
      Number(
        row.duration_minutes || 0
      ),

    completedAt:
      row.completed_at ||
      row.updated_at ||
      row.created_at ||
      null,

    createdAt:
      row.created_at || null,

    updatedAt:
      row.updated_at || null,

    // --------------------------------------
    // Per-question analysis
    //
    // This will work if the database has a
    // `questions` column containing JSON.
    // --------------------------------------

    questions,
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
      const meetingId =
        req.params.meetingId;

      if (
        !meetingId ||
        meetingId === "undefined" ||
        meetingId === "null"
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

      if (!row) {
        return res.status(404).json({
          success: false,
          message:
            "No report exists for this meeting.",
          report: null,
        });
      }

      const report =
        formatReport(row);

      return res.status(200).json({
        success: true,
        report,
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
//
// GET /api/reports/latest
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

      if (!row) {
        return res.status(404).json({
          success: false,
          message:
            "No interview report exists yet.",
          report: null,
        });
      }

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
//
// GET /api/reports
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
        count: reports.length,
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
//
// GET /api/reports/:id
// ==========================================

router.get(
  "/:id",
  (req, res) => {
    try {
      const reportId =
        req.params.id;

      if (
        !reportId ||
        reportId === "undefined" ||
        reportId === "null"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Report ID is required.",
          report: null,
        });
      }

      const row =
        db.prepare(`
          SELECT *
          FROM interview_reports
          WHERE id = ?
          LIMIT 1
        `).get(reportId);

      if (!row) {
        return res.status(404).json({
          success: false,
          message:
            "Report not found.",
          report: null,
        });
      }

      const report =
        formatReport(row);

      return res.status(200).json({
        success: true,
        report,
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
        report: null,
      });
    }
  }
);

// ==========================================
// POST REPORT
//
// POST /api/reports
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

        position,

        summary,

        strengths,
        gaps,
        weaknesses,

        next,
        nextSteps,

        questions,

        score,

        technicalScore,
        communicationScore,
        problemSolvingScore,
        experienceScore,
        overallScore,

        recommendation,

        status,

        durationMinutes,
      } = req.body;

      // ======================================
      // Scores
      // ======================================

      const technical =
        safeNumber(
          technicalScore ??
            score?.technical ??
            0
        );

      const communication =
        safeNumber(
          communicationScore ??
            score?.communication ??
            0
        );

      const problemSolving =
        safeNumber(
          problemSolvingScore ??
            score?.problemSolving ??
            0
        );

      const experience =
        safeNumber(
          experienceScore ??
            score?.experience ??
            0
        );

      let calculatedOverall =
        overallScore ??
        score?.overall;

      if (
        calculatedOverall ===
          undefined ||
        calculatedOverall ===
          null ||
        calculatedOverall === ""
      ) {
        const scoreValues = [
          technical,
          communication,
          problemSolving,
        ];

        if (experience > 0) {
          scoreValues.push(
            experience
          );
        }

        calculatedOverall =
          scoreValues.reduce(
            (total, value) =>
              total + value,
            0
          ) /
          scoreValues.length;
      }

      calculatedOverall =
        safeNumber(
          calculatedOverall
        );

      // ======================================
      // Arrays
      // ======================================

      const strengthsArray =
        Array.isArray(strengths)
          ? strengths
          : [];

      const gapsArray =
        Array.isArray(
          weaknesses
        )
          ? weaknesses
          : Array.isArray(gaps)
          ? gaps
          : [];

      const nextArray =
        Array.isArray(nextSteps)
          ? nextSteps
          : Array.isArray(next)
          ? next
          : [];

      const questionsArray =
        Array.isArray(questions)
          ? questions
          : [];

      // ======================================
      // Time
      // ======================================

      const now =
        new Date().toISOString();

      // ======================================
      // Existing report?
      // ======================================

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

      // ======================================
      // UPDATE EXISTING REPORT
      // ======================================

      if (existing) {
        /*
         * IMPORTANT:
         *
         * This UPDATE intentionally does not
         * update the optional `questions`
         * column because older databases may
         * not have that column yet.
         */

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

          employeeRequestId ||
            null,

          candidateName ||
            null,

          candidateEmail ||
            null,

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

          recommendation ||
            "Under Review",

          now,

          existing.id
        );

        // ------------------------------------
        // Update employee AI score
        // ------------------------------------

        if (
          employeeRequestId
        ) {
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
          } catch (scoreError) {
            console.error(
              "Unable to update employee AI score:",
              scoreError
            );
          }
        }

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

      // ======================================
      // CREATE NEW REPORT
      // ======================================

      const reportId =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}`;

      /*
       * This INSERT matches the columns already
       * present in your original backend.
       *
       * Therefore it will not break an existing
       * interview_reports table.
       */

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
        id: reportId,

        candidateId:
          candidateId || null,

        employeeRequestId:
          employeeRequestId ||
          null,

        candidateName:
          candidateName ||
          null,

        candidateEmail:
          candidateEmail ||
          null,

        meetingId:
          meetingId ||
          null,

        summary:
          summary ||
          "",

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
          recommendation ||
          "Under Review",

        createdAt: now,

        updatedAt: now,
      });

      // ======================================
      // UPDATE EMPLOYEE AI SCORE
      // ======================================

      if (
        employeeRequestId
      ) {
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
        } catch (scoreError) {
          console.error(
            "Unable to update employee AI score:",
            scoreError
          );
        }
      }

      // ======================================
      // LOAD CREATED REPORT
      // ======================================

      const row =
        db.prepare(`
          SELECT *
          FROM interview_reports
          WHERE id = ?
        `).get(reportId);

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