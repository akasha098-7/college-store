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
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});