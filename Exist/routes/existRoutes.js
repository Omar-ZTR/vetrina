const express = require('express');
const router = express.Router();
const existController = require('../controllers/existController');

router.post('/create-table', existController.createProduitTable);

router.get('/products', existController.getAllProducts);

router.put('/update-quant', existController.updateQuant);

router.get('/allproducts', existController.readAllProducts);

router.post('/insertProduct', existController.insertProduct);




module.exports = router;
