const db     = require("../db");
const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");

const JWT_SECRET = "quickpick_secret_2026"; // move to .env later

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
exports.login = (req, res) => {
  const { admission_number, password } = req.body;

  if (!admission_number || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all fields" });
  }

  const sql = "SELECT * FROM users WHERE admission_number = ?";

  db.query(sql, [admission_number], async (err, results) => {
    if (err) {
      console.error("Login DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid admission number or password" });
    }

    const user = results[0];

    // Compare entered password with hashed password in DB
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid admission number or password" });
    }

    // Create JWT token (lasts 24 hours)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Welcome to QuickPick!",
      token,
      user: {
        id:               user.id,
        first_name:       user.first_name,
        last_name:        user.last_name,
        admission_number: user.admission_number,
        role:             user.role
      }
    });
  });
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
exports.register = async (req, res) => {
  const { first_name, last_name, admission_number, password, email, phone } = req.body;

  if (!first_name || !last_name || !admission_number || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all fields" });
  }

  // Check if admission number already exists
  const checkSql = "SELECT id FROM users WHERE admission_number = ?";

  db.query(checkSql, [admission_number], async (err, results) => {
    if (err) {
      console.error("Register Check Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "Admission number already registered" });
    }

    try {
      // Hash the password before saving
      const hashed = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users (first_name, last_name, admission_number, password, email, phone)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(insertSql, [first_name, last_name, admission_number, hashed, email || null, phone || null], (err) => {
        if (err) {
          console.error("Register Insert Error:", err);
          return res.status(500).json({ success: false, message: "Could not create account" });
        }

        res.status(201).json({ success: true, message: "Account created successfully" });
      });

    } catch (err) {
      console.error("Bcrypt Error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};
