const express = require('express');
const router = express.Router();
const zaraControllers = require('../controllers/zaraControllers');

// create table produit 

router.post('/createtable', zaraControllers.createProduitTable);


// Get all produit

router.get('/produit', zaraControllers.getAllProduit);


// Update quant

router.get('/updating', zaraControllers.updateQuant);

module.exports = router;