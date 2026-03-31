require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

//////////////////////////////////////////////////////////
// 🔍 DEBUG LOGS
//////////////////////////////////////////////////////////

console.log("🚀 CLEAN SERVER RUNNING");
console.log("ENV FILE EXISTS:", fs.existsSync(__dirname + '/.env'));
console.log("ENV TEST:", process.env.JWT_SECRET);

//////////////////////////////////////////////////////////
// ✅ MIDDLEWARE
//////////////////////////////////////////////////////////

app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////////
// ✅ TEST ROUTE
//////////////////////////////////////////////////////////

app.put('/test-direct', (req, res) => {
  console.log("🔥 MAIN SERVER PUT HIT");
  res.send("MAIN SERVER WORKING");
});

//////////////////////////////////////////////////////////
// ✅ IMPORT ROUTES
//////////////////////////////////////////////////////////

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

//////////////////////////////////////////////////////////
// ✅ USE ROUTES (ALL BEFORE listen)
//////////////////////////////////////////////////////////

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);   // 🔥 FIXED POSITION
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

console.log("🔥 PRODUCT ROUTES LOADED");

//////////////////////////////////////////////////////////
// ✅ HOME
//////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.send('College Store Backend is Running!');
});

//////////////////////////////////////////////////////////
// ✅ START SERVER (ALWAYS LAST)
//////////////////////////////////////////////////////////

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});