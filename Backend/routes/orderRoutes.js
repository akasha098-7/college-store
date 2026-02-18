const express = require("express");
const router = express.Router();
const db = require("../db");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.post("/order", (req, res) => {
  const { student_id, items, total } = req.body;
  const orderCode = generateCode();

  const sql = "INSERT INTO orders (student_id, items, total, code) VALUES (?, ?, ?, ?)";

  db.query(sql, [student_id, JSON.stringify(items), total, orderCode], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      success: true,
      message: "Order placed",
      orderCode
    });
  });
});

module.exports = router;
