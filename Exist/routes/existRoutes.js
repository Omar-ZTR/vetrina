const express = require('express');
const router = express.Router();
const existController = require('../controllers/existController');

// Get all products
router.get('/products', existController.getAllProducts);

// Update quant
router.get('/updating', existController.updateQuant);

module.exports = router;