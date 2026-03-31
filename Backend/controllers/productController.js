const db = require("../db");

// GET all products
exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM products ORDER BY category, name", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ADD product (admin)
exports.addProduct = (req, res) => {
  const { name, price, stock, category } = req.body;
  if (!name || !category) return res.status(400).json({ message: "Name and category required" });
  db.query(
    "INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)",
    [name, price || 0, stock || 0, category],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Product added successfully!", id: result.insertId });
    }
  );
};

// UPDATE product (admin)
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  db.query(
    "UPDATE products SET name=?, price=?, stock=?, category=? WHERE id=?",
    [name, price, stock, category, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Product updated successfully!" });
    }
  );
};

// DELETE product (admin)
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product deleted successfully!" });
  });
};