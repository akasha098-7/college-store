const express = require('express');
const router = express.Router();
const db = require('../db');

console.log("🔥 CATEGORY ROUTES LOADED");

// ✅ GET ALL CATEGORIES
router.get('/', (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
});

// ✅ GET SINGLE CATEGORY
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result[0]);
  });
});

// ✅ ADD CATEGORY
router.post('/', (req, res) => {
  const { name, icon } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  db.query(
    "INSERT INTO categories (name, icon) VALUES (?, ?)",
    [name, icon || null],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Category added successfully" });
    }
  );
});

// ✅ UPDATE CATEGORY
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, icon, status } = req.body;

  db.query(
    "UPDATE categories SET name = ?, icon = ?, status = ? WHERE id = ?",
    [name, icon, status || 'Active', id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Category updated successfully" });
    }
  );
});

// ✅ DELETE CATEGORY
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Category deleted successfully" });
  });
});

module.exports = router;