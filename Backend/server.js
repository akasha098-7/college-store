const express = require('express');
const db = require('./db');
const cors = require('cors'); // Helps frontend talk to backend

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes (Put these BEFORE app.listen)
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// A test route to make sure everything is working
app.get('/test', (req, res) => {
    res.send('Backend Server is Live and Connected!');
});

// Test route to fetch products
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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
