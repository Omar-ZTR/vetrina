// const express = require('express');


// const router = express.Router();
// const zaraControllers = require('../controllers/zaraControllers');

// // create table produit 

// router.post('/createtable', zaraControllers.createProduitTable);


// // Get all produit

// router.get('/produit', zaraControllers.getAllProduit);


// // Update quant

// router.get('/updating', zaraControllers.updateQuant);

// module.exports = router;


const express = require('express');
const zaraController = require('../controllers/zaraControllers');

const router = express.Router();

router.post('/create-table', zaraController.createProduitTable);
;

router.get('/', zaraController.getAllProduit);
router.get("/getpath",zaraController.getAllAttriValues);
router.put('/', zaraController.updateQuant);
router.post('/insertProduit', zaraController.insertProduit);
module.exports = router;
