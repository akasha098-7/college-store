const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// This connects the URL /api/order to your controller logic
router.post('/order', orderController.placeOrder);

module.exports = router;