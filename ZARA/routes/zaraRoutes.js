const express = require('express');
const router = express.Router();
const zaraControllers = require('../controllers/zaraControllers');

// Get all products
router.get('/produit', zaraControllers.getAllProduit);

// Update quant
router.get('/updating', zaraControllers.updateQuant);

module.exports = router;