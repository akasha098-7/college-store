const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'quickpick_secret_2026';

// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Login required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(403).json({ message: 'Session expired' }); }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

router.post('/register', authController.register);
router.post('/login',    authController.login);

// ✅ GET ALL USERS (admin only)
router.get('/users', authenticate, adminOnly, (req, res) => {
  const db = require('../db');
  db.query(
    'SELECT id, first_name, last_name, admission_number, email, phone, role, created_at FROM users ORDER BY created_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(results);
    }
  );
});

module.exports = router;