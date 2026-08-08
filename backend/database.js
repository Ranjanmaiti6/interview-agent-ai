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

db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY,

    employee_request_id TEXT,

    employee_name TEXT NOT NULL,

    employee_email TEXT NOT NULL,

    title TEXT NOT NULL,

    description TEXT DEFAULT NULL,

    scheduled_at TEXT NOT NULL,

    duration_minutes INTEGER NOT NULL DEFAULT 30,

    status TEXT NOT NULL DEFAULT 'scheduled',

    meeting_url TEXT DEFAULT NULL,

    created_by TEXT NOT NULL,

    created_at TEXT NOT NULL,

    updated_at TEXT DEFAULT NULL
  )
`);

console.log("SQLite database ready.");

module.exports = db;