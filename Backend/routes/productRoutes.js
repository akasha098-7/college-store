const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/products', productController.getAllProducts);

// ADD product
router.post('/products', productController.addProduct);

module.exports = router;