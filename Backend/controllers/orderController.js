const db = require("../db");
exports.testOrdersRaw = (req, res) => {
  db.query("SELECT * FROM orders", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
// ─── PLACE ORDER ─────────────────────────────────────────────────────────────
// POST /api/orders
exports.placeOrder = (req, res) => {
  const { items } = req.body;
  const user_id   = req.user.id; // comes from JWT middleware in orderRoutes

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Calculate total
  const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Insert into orders table
  const orderSql = "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'Placed')";

  db.query(orderSql, [user_id, total_amount], (err, result) => {
    if (err) {
      console.error("Order insert error:", err);
      return res.status(500).json({ message: "Could not place order" });
    }

    const order_id = result.insertId;

    // Insert each item into order_items
    const itemSql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
    const values  = items.map(i => [order_id, i.product_id, i.quantity, i.price]);

    db.query(itemSql, [values], (err) => {
      if (err) {
        console.error("Order items insert error:", err);
        return res.status(500).json({ message: "Could not save order items" });
      }

      // Reduce stock for each product
      items.forEach(item => {
        db.query(
          "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
          [item.quantity, item.product_id, item.quantity]
        );
      });

      res.status(201).json({
        message:      "Order placed successfully!",
        order_id,
        total_amount
      });
    });
  });
};

// ─── GET MY ORDERS ────────────────────────────────────────────────────────────
// GET /api/orders/my
exports.getMyOrders = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT o.id, o.total_amount, o.status, o.order_date,
           oi.product_id, oi.quantity, oi.price, p.name AS product_name
    FROM orders o
    JOIN order_items oi ON o.id  = oi.order_id
    JOIN products p     ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("Fetch orders error:", err);
      return res.status(500).json({ message: "Could not fetch orders" });
    }

    // Group items under each order
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id:           row.id,
          total_amount: row.total_amount,
          status:       row.status,
          order_date:   row.order_date,
          items:        []
        };
      }
      grouped[row.id].items.push({
        product_name: row.product_name,
        quantity:     row.quantity,
        price:        row.price
      });
    });

    res.json(Object.values(grouped));
  });
};
//get all orders(admin)
exports.getAllOrders = (req, res) => {
  const sql = `
    SELECT o.id, o.user_id, o.total_amount, o.status, o.order_date,
           oi.product_id, oi.quantity, oi.price, p.name AS product_name
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching orders" });

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id: row.id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          status: row.status,
          order_date: row.order_date,
          items: []
        };
      }

      grouped[row.id].items.push({
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.json(Object.values(grouped));
  });
};
//Update order status
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });

      res.json({ message: "Order status updated" });
    }
  );
};
// ✅ TEST FUNCTION (FINAL — OUTSIDE EVERYTHING)
exports.testOrdersRaw = (req, res) => {
  const db = require("../db");

  db.query("SELECT * FROM orders", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};