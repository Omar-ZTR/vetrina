const express = require("express");
const router = express.Router();
const vetrinaController = require("../controllers/vetrinaController");

router.post("/create-tables",vetrinaController. createTables);

router.post("/posted", vetrinaController.posted);
router.post("/insert-api-data", vetrinaController.insertApiData);
router.get("/update", vetrinaController.update);

module.exports = router;
