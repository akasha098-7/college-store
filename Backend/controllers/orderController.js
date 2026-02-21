const db = require("../db");

function generateOrderCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

exports.placeOrder = (req, res) => {
    const { user_id, total_amount } = req.body;
    const orderCode = generateOrderCode();

    const sql = "INSERT INTO orders (user_id, total_amount, order_code) VALUES (?, ?, ?)";
    
    db.query(sql, [user_id, total_amount, orderCode], (err, result) => {
        if (err) {
            console.error("Order Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ 
            success: true, 
            message: "Order placed successfully!", 
            order_code: orderCode 
        });
    });
};