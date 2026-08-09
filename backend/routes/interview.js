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
  // Prefer employee request
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
          request.name,

        candidateEmail:
          request.email,
      };
    }
  }

  // ----------------------------------------
  // Employee request by email
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
          request.name,

        candidateEmail:
          request.email,
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
          user.name,

        candidateEmail:
          user.email,
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
      normalizedEmail,
  };
}

// ==========================================
// Save / update interview report
// ==========================================

function saveInterviewReport({
  result,
  candidate,
  meetingId,
  questionNumber,
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
    // Find existing report
    //
    // One report per meeting when meetingId
    // exists.
    //
    // Otherwise one report per candidate.
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

    // ----------------------------------------
    // Update existing report
    // ----------------------------------------

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
        JSON.stringify(
          []
        ),
        technical,
        communication,
        problemSolving,
        overall,
        recommendation,
        now,
        existingReport.id
      );

      // Update candidate score
      if (
        candidate.employeeRequestId
      ) {
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
      }

      return existingReport.id;
    }

    // ----------------------------------------
    // Create new report
    // ----------------------------------------

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
        JSON.stringify(
          []
        ),

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

    // ----------------------------------------
    // Update candidate AI score
    // ----------------------------------------

    if (
      candidate.employeeRequestId
    ) {
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
    }

    console.log(
      "Interview report created:",
      {
        reportId,
        candidateId:
          candidate.candidateId,
        meetingId:
          meetingId || null,
        questionNumber,
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
// POST /api/interview/answer
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
      // Generate evaluation + next question
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
      // SAVE REPORT
      //
      // This was missing from your old route.
      //
      // We save/update the report after every
      // AI answer so that the report cannot
      // remain completely empty.
      // ======================================

      const reportId =
        saveInterviewReport({
          result,
          candidate,
          meetingId,
          questionNumber:
            parsedQuestionNumber,
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
        "Interview route error:",
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

module.exports = router;