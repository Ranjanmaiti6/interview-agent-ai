const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.db");

const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// ==========================================
// Employee interview requests
// ==========================================

db.exec(`
  CREATE TABLE IF NOT EXISTS employee_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    ai_score REAL DEFAULT NULL,

    resume_original_name TEXT,
    resume_filename TEXT,
    resume_path TEXT,
    resume_url TEXT,
    resume_size INTEGER,
    resume_uploaded_at TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT NULL
  )
`);

// ==========================================
// Meetings
// ==========================================
//
// IMPORTANT:
// This schema is compatible with the meetings
// API and the React frontend.
//
// We intentionally keep both employee_request_id
// and the employee information so a meeting can
// still work even if the employee-request system
// changes later.
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

    meeting_url TEXT DEFAULT NULL,

    created_by TEXT DEFAULT NULL,

    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT NULL
  )
`);

// ==========================================
// Database migration helper
// ==========================================

function getColumns(tableName) {
  return db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all()
    .map((column) => column.name);
}

function addColumnIfMissing(
  tableName,
  columnName,
  definition
) {
  const columns = getColumns(tableName);

  if (!columns.includes(columnName)) {
    console.log(
      `Adding missing column ${columnName} to ${tableName}`
    );

    db.exec(`
      ALTER TABLE ${tableName}
      ADD COLUMN ${columnName} ${definition}
    `);
  }
}

// ==========================================
// Meetings migration
// ==========================================

try {
  addColumnIfMissing(
    "meetings",
    "employee_request_id",
    "TEXT DEFAULT NULL"
  );

  addColumnIfMissing(
    "meetings",
    "employee_name",
    "TEXT DEFAULT NULL"
  );

  addColumnIfMissing(
    "meetings",
    "description",
    "TEXT DEFAULT NULL"
  );

  addColumnIfMissing(
    "meetings",
    "duration_minutes",
    "INTEGER NOT NULL DEFAULT 30"
  );

  addColumnIfMissing(
    "meetings",
    "meeting_url",
    "TEXT DEFAULT NULL"
  );

  addColumnIfMissing(
    "meetings",
    "created_by",
    "TEXT DEFAULT NULL"
  );

  addColumnIfMissing(
    "meetings",
    "updated_at",
    "TEXT DEFAULT NULL"
  );

  // ========================================
  // Old code used meeting_link.
  // Copy it into meeting_url if necessary.
  // ========================================

  const meetingColumns =
    getColumns("meetings");

  if (
    meetingColumns.includes("meeting_link") &&
    meetingColumns.includes("meeting_url")
  ) {
    db.exec(`
      UPDATE meetings
      SET meeting_url = meeting_link
      WHERE
        meeting_url IS NULL
        AND meeting_link IS NOT NULL
    `);
  }

  console.log(
    "Meetings database migration checked."
  );

} catch (error) {
  console.error(
    "Meetings database migration error:",
    error
  );
}

// ==========================================
// Database ready
// ==========================================

console.log(
  "SQLite database ready."
);

console.log(
  `Database file: ${dbPath}`
);

module.exports = db;