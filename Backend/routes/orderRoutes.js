const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const orderController = require("../controllers/orderController");

const JWT_SECRET = "quickpick_secret_2026"; // must match authController.js

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token      = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Session expired. Please log in again." });
  }
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────
router.post("/",    authenticate, orderController.placeOrder);   // POST /api/orders
router.get("/my",   authenticate, orderController.getMyOrders);  // GET  /api/orders/my

module.exports = router;