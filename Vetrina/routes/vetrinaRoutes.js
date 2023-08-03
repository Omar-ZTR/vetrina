const express = require('express');
const router = express.Router();
const VetrinaController = require('../controllers/vetrinaController');

router.post('/insert', VetrinaController.insertApiData);
router.post('/inserturls', VetrinaController.insertUrlS);
router.post('/paths', VetrinaController.insertpathS);

router.put('/', VetrinaController.updated);
router.get('/findone',VetrinaController.getproduitspecif);


module.exports = router;
