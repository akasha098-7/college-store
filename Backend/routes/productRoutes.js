const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/products', (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// ADD product
router.post('/products', (req, res) => {
    const { name, price, stock } = req.body;

    const sql = "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";
    db.query(sql, [name, price, stock], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.json({ message: "Product added successfully!" });
    });
});

module.exports = router;
