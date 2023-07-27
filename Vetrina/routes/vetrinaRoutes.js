const express = require('express');
const router = express.Router();
const VetrinaController = require('../controllers/vetrinaController');

// router.post('/', VetrinaController.posted);
router.post('/insert', VetrinaController.insertApiData);
router.put('/', VetrinaController.update);
router.get('/fromPath',VetrinaController.getAllAttriValues);
router.get('/getDataFromPath', async (req, res) => {
    try {
      const { brand } = req.query;
      if (!brand) {
        throw new Error("No brand provided");
      }
      const result = await VetrinaController.getDataFromPath(brand);
      res.status(200).json({ data: result });
    } catch (error) {
      console.error("Error fetching data from path:", error.message);
      res.status(500).json({ error: "Error fetching data from path" });
    }
  });

module.exports = router;
