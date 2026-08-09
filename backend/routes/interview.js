const express = require("express");

const router = express.Router();

const db = require("../database");

const {
  generateQuestion,
} = require("../agent/interviewAgent");

// ==========================================
// Helpers
// ==========================================

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function safeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

function calculateOverall(score) {
  const technical =
    safeNumber(score?.technical);

  const communication =
    safeNumber(score?.communication);

  const problemSolving =
    safeNumber(score?.problemSolving);

  return Number(
    (
      (
        technical +
        communication +
        problemSolving
      ) / 3
    ).toFixed(2)
  );
}

// ==========================================
// Find candidate information
// ==========================================

function findCandidate({
  candidateId,
  employeeEmail,
}) {
  const normalizedEmail =
    employeeEmail
      ? String(employeeEmail)
          .trim()
          .toLowerCase()
      : null;

  // ----------------------------------------
  // Try employee request by ID
  // ----------------------------------------

  if (candidateId) {
    const request = db
      .prepare(`
        SELECT *
        FROM employee_requests
        WHERE id = ?
        LIMIT 1
      `)
      .get(candidateId);

    if (request) {
      return {
        candidateId:
          request.id,

        employeeRequestId:
          request.id,

        candidateName:
          request.name ||
          request.employee_name ||
          "Candidate",

        candidateEmail:
          request.email ||
          "",
      };
    }
  }

  // ----------------------------------------
  // Try employee request by email
  // ----------------------------------------

  if (normalizedEmail) {
    const request = db
      .prepare(`
        SELECT *
        FROM employee_requests
        WHERE LOWER(email) = ?
        ORDER BY created_at DESC
        LIMIT 1
      `)
      .get(normalizedEmail);

    if (request) {
      return {
        candidateId:
          request.id,

        employeeRequestId:
          request.id,

        candidateName:
          request.name ||
          request.employee_name ||
          "Candidate",

        candidateEmail:
          request.email ||
          normalizedEmail,
      };
    }

    // --------------------------------------
    // Fallback to users
    // --------------------------------------

    const user = db
      .prepare(`
        SELECT *
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
      `)
      .get(normalizedEmail);

    if (user) {
      return {
        candidateId:
          user.id,

        employeeRequestId:
          null,

        candidateName:
          user.name ||
          "Candidate",

        candidateEmail:
          user.email ||
          normalizedEmail,
      };
    }
  }

  return {
    candidateId:
      candidateId || null,

    employeeRequestId:
      null,

    candidateName:
      null,

    candidateEmail:
      normalizedEmail || "",
  };
}

// ==========================================
// Save / update interview report
// ==========================================

function saveInterviewReport({
  result,
  candidate,
  meetingId,
}) {
  try {
    const score =
      result?.score || {};

    const technical =
      safeNumber(
        score.technical
      );

    const communication =
      safeNumber(
        score.communication
      );

    const problemSolving =
      safeNumber(
        score.problemSolving
      );

    const overall =
      safeNumber(
        score.overall,
        calculateOverall(score)
      );

    const strengths =
      safeArray(
        result?.strengths
      );

    const gaps =
      safeArray(
        result?.gaps
      );

    const recommendation =
      String(
        result?.recommendation ||
          ""
      );

    const summary =
      String(
        result?.feedback ||
          ""
      );

    const now =
      new Date().toISOString();

    // ----------------------------------------
    // Find existing report by meeting
    // ----------------------------------------

    let existingReport = null;

    if (meetingId) {
      existingReport = db
        .prepare(`
          SELECT *
          FROM interview_reports
          WHERE meeting_id = ?
          ORDER BY created_at DESC
          LIMIT 1
        `)
        .get(meetingId);
    }

    // ----------------------------------------
    // Find report by candidate if there is
    // no meeting ID
    // ----------------------------------------

    if (
      !existingReport &&
      candidate.candidateId
    ) {
      existingReport = db
        .prepare(`
          SELECT *
          FROM interview_reports
          WHERE candidate_id = ?
          AND (
            meeting_id IS NULL
            OR meeting_id = ''
          )
          ORDER BY created_at DESC
          LIMIT 1
        `)
        .get(
          candidate.candidateId
        );
    }

    // ======================================
    // UPDATE
    // ======================================

    if (existingReport) {
      db.prepare(`
        UPDATE interview_reports
        SET
          candidate_id = ?,
          employee_request_id = ?,
          candidate_name = ?,
          candidate_email = ?,
          meeting_id = ?,
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
        candidate.candidateId,

        candidate.employeeRequestId,

        candidate.candidateName,

        candidate.candidateEmail,

        meetingId || null,

        summary,

        JSON.stringify(
          strengths
        ),

        JSON.stringify(
          gaps
        ),

        JSON.stringify([]),

        technical,

        communication,

        problemSolving,

        overall,

        recommendation,

        now,

        existingReport.id
      );

      // ------------------------------------
      // Update employee AI score
      // ------------------------------------

      if (
        candidate.employeeRequestId
      ) {
        try {
          db.prepare(`
            UPDATE employee_requests
            SET
              ai_score = ?,
              updated_at = ?
            WHERE id = ?
          `).run(
            overall,
            now,
            candidate.employeeRequestId
          );
        } catch (error) {
          console.error(
            "Unable to update employee AI score:",
            error
          );
        }
      }

      return existingReport.id;
    }

    // ======================================
    // CREATE
    // ======================================

    const reportId =
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
      id: reportId,

      candidateId:
        candidate.candidateId,

      employeeRequestId:
        candidate.employeeRequestId,

      candidateName:
        candidate.candidateName,

      candidateEmail:
        candidate.candidateEmail,

      meetingId:
        meetingId || null,

      summary,

      strengths:
        JSON.stringify(
          strengths
        ),

      gaps:
        JSON.stringify(
          gaps
        ),

      nextSteps:
        JSON.stringify([]),

      technicalScore:
        technical,

      communicationScore:
        communication,

      problemSolvingScore:
        problemSolving,

      overallScore:
        overall,

      recommendation,

      createdAt: now,

      updatedAt: now,
    });

    // ------------------------------------
    // Update employee AI score
    // ------------------------------------

    if (
      candidate.employeeRequestId
    ) {
      try {
        db.prepare(`
          UPDATE employee_requests
          SET
            ai_score = ?,
            updated_at = ?
          WHERE id = ?
        `).run(
          overall,
          now,
          candidate.employeeRequestId
        );
      } catch (error) {
        console.error(
          "Unable to update employee AI score:",
          error
        );
      }
    }

    console.log(
      "Interview report created:",
      {
        reportId,
        candidateId:
          candidate.candidateId,
        meetingId:
          meetingId || null,
      }
    );

    return reportId;
  } catch (error) {
    console.error(
      "Save interview report error:",
      error
    );

    return null;
  }
}

// ==========================================
// Mark meeting completed
// ==========================================

function markMeetingCompleted(
  meetingId
) {
  if (!meetingId) {
    return;
  }

  try {
    db.prepare(`
      UPDATE meetings
      SET
        status = 'completed',
        updated_at = ?
      WHERE id = ?
    `).run(
      new Date().toISOString(),
      meetingId
    );

    console.log(
      "Meeting marked completed:",
      meetingId
    );
  } catch (error) {
    /*
     * Do not fail the interview if the
     * meetings table uses a different schema.
     */
    console.warn(
      "Unable to mark meeting completed:",
      error.message
    );
  }
}

// ==========================================
// POST /answer
//
// This is used while the AI interview is
// running.
// ==========================================

router.post(
  "/answer",
  async (req, res) => {
    try {
      const {
        answer,
        questionNumber,
        candidateId,
        meetingId,
        employeeEmail,
      } = req.body;

      // ======================================
      // Validate answer
      // ======================================

      if (
        typeof answer !==
          "string" ||
        !answer.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Answer is required.",
        });
      }

      // ======================================
      // Validate question number
      // ======================================

      if (
        questionNumber ===
          undefined ||
        questionNumber === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question number is required.",
        });
      }

      const parsedQuestionNumber =
        Number(questionNumber);

      if (
        Number.isNaN(
          parsedQuestionNumber
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question number must be a number.",
        });
      }

      // ======================================
      // Candidate identifier
      // ======================================

      const interviewCandidateId =
        candidateId ||
        employeeEmail ||
        meetingId;

      if (
        !interviewCandidateId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate, employee email, or meeting ID is required.",
        });
      }

      console.log(
        "Processing interview answer:",
        {
          candidateId:
            candidateId || null,

          employeeEmail:
            employeeEmail || null,

          meetingId:
            meetingId || null,

          questionNumber:
            parsedQuestionNumber,
        }
      );

      // ======================================
      // AI evaluation
      // ======================================

      const result =
        await generateQuestion(
          answer.trim(),
          parsedQuestionNumber,
          interviewCandidateId
        );

      // ======================================
      // Find candidate
      // ======================================

      const candidate =
        findCandidate({
          candidateId:
            candidateId ||
            interviewCandidateId,

          employeeEmail,
        });

      // ======================================
      // Save current evaluation
      // ======================================

      const reportId =
        saveInterviewReport({
          result,
          candidate,
          meetingId,
        });

      // ======================================
      // Return result
      // ======================================

      return res.status(200).json({
        success: true,

        candidate:
          result.candidate ||
          candidate.candidateName ||
          "Candidate",

        topic:
          result.topic,

        feedback:
          result.feedback,

        nextQuestion:
          result.nextQuestion,

        score:
          result.score || {
            technical: 0,
            communication: 0,
            problemSolving: 0,
          },

        strengths:
          result.strengths || [],

        gaps:
          result.gaps || [],

        recommendation:
          result.recommendation || "",

        questionNumber:
          result.questionNumber ??
          parsedQuestionNumber,

        reportId,

        meetingId:
          meetingId || null,

        employeeEmail:
          employeeEmail || null,

        reportSaved:
          Boolean(reportId),
      });
    } catch (error) {
      console.error(
        "Interview answer route error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to process interview answer.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);

// ==========================================
// POST /complete
//
// POST /api/interviews/complete
//
// Called by Interview.jsx when the interview
// is finished.
// ==========================================

router.post(
  "/complete",
  async (req, res) => {
    try {
      const {
        meetingId,
        candidateId,
        employeeEmail,
        answers,
        durationSeconds,
      } = req.body;

      // ======================================
      // Validate
      // ======================================

      if (!meetingId) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting ID is required.",
        });
      }

      // ======================================
      // Normalize answers
      // ======================================

      const finalAnswers =
        Array.isArray(answers)
          ? answers
          : [];

      // ======================================
      // Find candidate
      // ======================================

      const candidate =
        findCandidate({
          candidateId,
          employeeEmail,
        });

      // ======================================
      // Calculate scores from the latest
      // saved report if it exists.
      // ======================================

      let existingReport =
        db
          .prepare(`
            SELECT *
            FROM interview_reports
            WHERE meeting_id = ?
            ORDER BY created_at DESC
            LIMIT 1
          `)
          .get(meetingId);

      // ======================================
      // If there is no report yet, create a
      // basic completed report.
      // ======================================

      if (!existingReport) {
        const fallbackResult = {
          score: {
            technical: 0,
            communication: 0,
            problemSolving: 0,
            overall: 0,
          },

          feedback:
            finalAnswers.length > 0
              ? `Interview completed with ${finalAnswers.length} answered question(s).`
              : "Interview completed without recorded answers.",

          strengths: [],

          gaps: [],

          recommendation:
            "Under Review",
        };

        const reportId =
          saveInterviewReport({
            result:
              fallbackResult,

            candidate,

            meetingId,
          });

        existingReport =
          reportId
            ? db
                .prepare(`
                  SELECT *
                  FROM interview_reports
                  WHERE id = ?
                  LIMIT 1
                `)
                .get(reportId)
            : null;
      }

      // ======================================
      // Update report summary using the final
      // interview answers.
      // ======================================

      if (existingReport) {
        const currentSummary =
          existingReport.summary ||
          "";

        let summary =
          currentSummary;

        if (
          finalAnswers.length > 0
        ) {
          summary =
            `${currentSummary || "Interview completed."} ` +
            `The candidate submitted ${finalAnswers.length} answer(s) during the interview.`;
        }

        const now =
          new Date().toISOString();

        db.prepare(`
          UPDATE interview_reports
          SET
            candidate_id = ?,
            employee_request_id = ?,
            candidate_name = ?,
            candidate_email = ?,
            meeting_id = ?,
            summary = ?,
            updated_at = ?
          WHERE id = ?
        `).run(
          candidate.candidateId,

          candidate.employeeRequestId,

          candidate.candidateName ||
            existingReport.candidate_name,

          candidate.candidateEmail ||
            existingReport.candidate_email,

          meetingId,

          summary,

          now,

          existingReport.id
        );
      }

      // ======================================
      // Mark meeting completed
      // ======================================

      markMeetingCompleted(
        meetingId
      );

      // ======================================
      // Final response
      // ======================================

      const report =
        existingReport
          ? db
              .prepare(`
                SELECT *
                FROM interview_reports
                WHERE id = ?
                LIMIT 1
              `)
              .get(
                existingReport.id
              )
          : null;

      return res.status(200).json({
        success: true,

        message:
          "Interview completed successfully.",

        meetingId,

        reportId:
          report?.id || null,

        durationSeconds:
          safeNumber(
            durationSeconds
          ),

        answersCount:
          finalAnswers.length,

        report: report || null,
      });
    } catch (error) {
      console.error(
        "Interview completion error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to complete interview.",

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