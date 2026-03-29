const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const orderController = require("../controllers/orderController");
console.log("orderController:", orderController);
const JWT_SECRET = process.env.JWT_SECRET;

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("TOKEN:", token);
  console.log("SECRET:", process.env.JWT_SECRET);
console.log("🔥 ORDER ROUTES LOADED");
  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(403).json({ message: "Session expired. Please log in again." });
  }
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────
router.get('/test', orderController.testOrdersRaw);
router.post("/",    authenticate, orderController.placeOrder);   // POST /api/orders
router.get("/my",   authenticate, orderController.getMyOrders);  // GET  /api/orders/my
router.get('/', authenticate, orderController.getAllOrders);
router.put('/:id', authenticate, orderController.updateOrderStatus);

module.exports = router;