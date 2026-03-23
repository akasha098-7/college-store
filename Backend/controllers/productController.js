const db = require("../db");

// GET all products
exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM products ORDER BY category, name", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ADD product (used by admin)
exports.addProduct = (req, res) => {
  const { name, price, stock, category } = req.body;

  if (!name || !price || !stock || !category) {
    return res.status(400).json({ message: "All fields required: name, price, stock, category" });
  }

  const sql = "INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, stock, category], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product added successfully!", id: result.insertId });
  });
};