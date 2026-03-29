require('dotenv').config({ path: __dirname + '/.env' });
console.log("ENV TEST:", process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');

const app = express();

console.log("🚀 CLEAN SERVER RUNNING");
const fs = require('fs');

console.log("ENV FILE EXISTS:", fs.existsSync(__dirname + '/.env'));
// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ TEST PUT (keep this always for debugging)
app.put('/test-direct', (req, res) => {
  console.log("🔥 MAIN SERVER PUT HIT");
  res.send("MAIN SERVER WORKING");
});

// ✅ IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// ✅ USE ROUTES (VERY IMPORTANT ORDER)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// ✅ HOME
app.get('/', (req, res) => {
  res.send('College Store Backend is Running!');
});

// ✅ START
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});