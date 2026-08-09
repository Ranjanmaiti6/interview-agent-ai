const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database");

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "development_secret_change_this";

// ==========================================
// Create JWT
// ==========================================

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// ==========================================
// Ensure demo admin exists
// ==========================================

function ensureAdminUser() {
  try {
    const email = "admin@example.com";
    const password = "admin123";

    const existingAdmin = db
      .prepare(`
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
      `)
      .get(email);

    // ----------------------------------------
    // Create admin if missing
    // ----------------------------------------

    if (!existingAdmin) {
      const hashedPassword =
        bcrypt.hashSync(password, 10);

      db.prepare(`
        INSERT INTO users (
          id,
          name,
          email,
          password,
          role,
          created_at,
          updated_at
        )
        VALUES (
          @id,
          @name,
          @email,
          @password,
          @role,
          @createdAt,
          @updatedAt
        )
      `).run({
        id: "admin-001",
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
        createdAt:
          new Date().toISOString(),
        updatedAt: null,
      });

      console.log(
        "Default admin account created."
      );

      return;
    }

    // ----------------------------------------
    // Repair demo admin password if necessary
    // ----------------------------------------

    const passwordValid =
      bcrypt.compareSync(
        password,
        existingAdmin.password
      );

    if (!passwordValid) {
      const hashedPassword =
        bcrypt.hashSync(password, 10);

      db.prepare(`
        UPDATE users
        SET
          password = @password,
          role = 'admin',
          name = 'Admin',
          updated_at = @updatedAt
        WHERE email = @email
      `).run({
        email,
        password: hashedPassword,
        updatedAt:
          new Date().toISOString(),
      });

      console.log(
        "Default admin password repaired."
      );
    }
  } catch (error) {
    console.error(
      "Unable to ensure default admin:",
      error
    );
  }
}

// ==========================================
// Ensure demo employee exists
// ==========================================

function ensureEmployeeUser() {
  try {
    const email =
      "employee@example.com";

    const password =
      "employee123";

    const existingEmployee = db
      .prepare(`
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
      `)
      .get(email);

    // ----------------------------------------
    // Create employee if missing
    // ----------------------------------------

    if (!existingEmployee) {
      const hashedPassword =
        bcrypt.hashSync(password, 10);

      const id =
        "employee-001";

      const createdAt =
        new Date().toISOString();

      db.prepare(`
        INSERT INTO users (
          id,
          name,
          email,
          password,
          role,
          created_at,
          updated_at
        )
        VALUES (
          @id,
          @name,
          @email,
          @password,
          @role,
          @createdAt,
          @updatedAt
        )
      `).run({
        id,
        name: "Employee",
        email,
        password: hashedPassword,
        role: "employee",
        createdAt,
        updatedAt: null,
      });

      console.log(
        "Default employee account created."
      );

      ensureEmployeeCandidate({
        id,
        name: "Employee",
        email,
        createdAt,
      });

      return;
    }

    // ----------------------------------------
    // Repair demo employee password if needed
    // ----------------------------------------

    const passwordValid =
      bcrypt.compareSync(
        password,
        existingEmployee.password
      );

    if (!passwordValid) {
      const hashedPassword =
        bcrypt.hashSync(password, 10);

      db.prepare(`
        UPDATE users
        SET
          password = @password,
          role = 'employee',
          name = 'Employee',
          updated_at = @updatedAt
        WHERE email = @email
      `).run({
        email,
        password: hashedPassword,
        updatedAt:
          new Date().toISOString(),
      });

      console.log(
        "Default employee password repaired."
      );
    }

    // ----------------------------------------
    // Make sure candidate exists
    // ----------------------------------------

    ensureEmployeeCandidate({
      id: existingEmployee.id,
      name:
        existingEmployee.name ||
        "Employee",
      email:
        existingEmployee.email,
      createdAt:
        existingEmployee.created_at ||
        new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Unable to ensure default employee:",
      error
    );
  }
}

// ==========================================
// Ensure employee candidate exists
// ==========================================

function ensureEmployeeCandidate({
  id,
  name,
  email,
  createdAt,
}) {
  try {
    const existingCandidate =
      db
        .prepare(`
          SELECT id
          FROM employee_requests
          WHERE email = ?
          LIMIT 1
        `)
        .get(email);

    if (existingCandidate) {
      return;
    }

    db.prepare(`
      INSERT INTO employee_requests (
        id,
        name,
        email,
        status,
        ai_score,

        resume_original_name,
        resume_filename,
        resume_path,
        resume_url,
        resume_size,
        resume_uploaded_at,

        created_at,
        updated_at
      )
      VALUES (
        @id,
        @name,
        @email,
        @status,
        @aiScore,

        @resumeOriginalName,
        @resumeFilename,
        @resumePath,
        @resumeUrl,
        @resumeSize,
        @resumeUploadedAt,

        @createdAt,
        @updatedAt
      )
    `).run({
      id: `candidate-${id}`,
      name,
      email,

      status: "pending",

      aiScore: null,

      resumeOriginalName: null,
      resumeFilename: null,
      resumePath: null,
      resumeUrl: null,
      resumeSize: null,
      resumeUploadedAt: null,

      createdAt,
      updatedAt: null,
    });

    console.log(
      "Default employee candidate created."
    );
  } catch (error) {
    console.error(
      "Unable to ensure employee candidate:",
      error
    );
  }
}

// ==========================================
// Initialize demo accounts
// ==========================================

ensureAdminUser();
ensureEmployeeUser();

// ==========================================
// SIGNUP
// ==========================================

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // ======================================
    // Validate input
    // ======================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    const normalizedName =
      name.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot be empty.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    // ======================================
    // Check existing user
    // ======================================

    const existingUser = db
      .prepare(`
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
      `)
      .get(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ======================================
    // Hash password
    // ======================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const id =
      Date.now().toString();

    const createdAt =
      new Date().toISOString();

    // ======================================
    // Create employee user
    // ======================================

    db.prepare(`
      INSERT INTO users (
        id,
        name,
        email,
        password,
        role,
        created_at,
        updated_at
      )
      VALUES (
        @id,
        @name,
        @email,
        @password,
        @role,
        @createdAt,
        @updatedAt
      )
    `).run({
      id,
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "employee",
      createdAt,
      updatedAt: null,
    });

    // ======================================
    // Automatically create candidate
    // ======================================

    const existingCandidate = db
      .prepare(`
        SELECT id
        FROM employee_requests
        WHERE email = ?
        LIMIT 1
      `)
      .get(normalizedEmail);

    if (!existingCandidate) {
      db.prepare(`
        INSERT INTO employee_requests (
          id,
          name,
          email,
          status,
          ai_score,

          resume_original_name,
          resume_filename,
          resume_path,
          resume_url,
          resume_size,
          resume_uploaded_at,

          created_at,
          updated_at
        )
        VALUES (
          @id,
          @name,
          @email,
          @status,
          @aiScore,

          @resumeOriginalName,
          @resumeFilename,
          @resumePath,
          @resumeUrl,
          @resumeSize,
          @resumeUploadedAt,

          @createdAt,
          @updatedAt
        )
      `).run({
        id: `candidate-${id}`,
        name: normalizedName,
        email: normalizedEmail,

        status: "pending",

        aiScore: null,

        resumeOriginalName: null,
        resumeFilename: null,
        resumePath: null,
        resumeUrl: null,
        resumeSize: null,
        resumeUploadedAt: null,

        createdAt,
        updatedAt: null,
      });

      console.log(
        "Candidate automatically created:",
        {
          id: `candidate-${id}`,
          name: normalizedName,
          email: normalizedEmail,
        }
      );
    }

    // ======================================
    // Public user
    // ======================================

    const user = {
      id,
      name: normalizedName,
      email: normalizedEmail,
      role: "employee",
    };

    // ======================================
    // Create token
    // ======================================

    const token =
      createToken(user);

    console.log(
      "New employee account created:",
      user
    );

    // ======================================
    // Response
    // ======================================

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during signup.",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ======================================
    // Validate input
    // ======================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // ======================================
    // Find user
    // ======================================

    const user = db
      .prepare(`
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
      `)
      .get(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ======================================
    // Verify password
    // ======================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ======================================
    // Public user
    // ======================================

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // ======================================
    // Create token
    // ======================================

    const token =
      createToken(publicUser);

    // ======================================
    // Response
    // ======================================

    return res.json({
      success: true,
      token,
      user: publicUser,
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login.",
    });
  }
});

module.exports = router;