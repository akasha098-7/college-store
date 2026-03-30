const db = require("../db");

// GET all categories
exports.getCategories = (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ADD category
exports.addCategory = (req, res) => {
  const { name, icon } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name required" });
  }

  const sql = "INSERT INTO categories (name, icon) VALUES (?, ?)";
  db.query(sql, [name, icon || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      message: "Category added!",
      id: result.insertId
    });
  });
};

// DELETE category
exports.deleteCategory = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Category deleted" });
  });
};