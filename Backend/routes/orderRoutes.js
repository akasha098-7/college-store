const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const orderController = require("../controllers/orderController");

const JWT_SECRET = process.env.JWT_SECRET || "quickpick_secret_2026";

// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Login required" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(403).json({ message: "Session expired" }); }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}

router.post("/",           authenticate, orderController.placeOrder);
router.get("/my",          authenticate, orderController.getMyOrders);
router.get("/all",         authenticate, adminOnly, orderController.getAllOrders);      // ✅ admin
router.put("/:id/status",  authenticate, adminOnly, orderController.updateOrderStatus); // ✅ admin
router.get("/test",        orderController.testOrdersRaw);

module.exports = router;