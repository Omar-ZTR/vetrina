const express = require("express");
const router = express.Router();
const vetrinaController = require("../controllers/vetrinaController");

// Define the routes
router.post("/posted", vetrinaController.posted);
router.post("/insert-api-data", vetrinaController.insertApiData);
router.get("/update", vetrinaController.update);

module.exports = router;