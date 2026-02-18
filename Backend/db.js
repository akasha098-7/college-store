const mysql = require('mysql2');

// Connection settings for XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // XAMPP default
    password: '',      // XAMPP default is empty
    database: 'college_store'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to XAMPP MySQL Database.');
});

module.exports = db;