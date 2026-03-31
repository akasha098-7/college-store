const express = require('express');
const router  = express.Router();
const productController = require('../controllers/productController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'quickpick_secret_2026';

function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Login required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(403).json({ message: 'Session expired' }); }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

router.get('/',     productController.getAllProducts);
router.post('/',    authenticate, adminOnly, productController.addProduct);
router.put('/:id',  authenticate, adminOnly, productController.updateProduct);
router.delete('/:id', authenticate, adminOnly, productController.deleteProduct);

module.exports = router;