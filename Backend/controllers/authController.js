const db = require("../db");

exports.login = (req, res) => {
    // This now matches the name we will send from login.js
    const { admission_no, password } = req.body;

    const sql = "SELECT * FROM users WHERE admission_no = ? AND password = ?";
    
    db.query(sql, [admission_no, password], (err, results) => {
        if (err) {
            console.error("Login Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length > 0) {
            // Success!
            res.json({ success: true, message: "Welcome to QuickPick!", user: results[0] });
        } else {
            // No user found
            res.json({ success: false, message: "Invalid Admission Number or Password" });
        }
    });
};

exports.register = (req, res) => {
    res.json({ message: "Registration logic coming soon!" });
};