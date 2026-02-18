const express = require('express');
const db = require('./db');
const cors = require('cors'); // Helps frontend talk to backend

const app = express();
app.use(cors());
app.use(express.json());

// A test route to make sure everything is working
app.get('/test', (req, res) => {
    res.send('Backend Server is Live and Connected!');
});

const PORT = 3000;
// Test route to fetch products from the database
app.get('/test-products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: "Database is definitely working!",
            data: results
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});