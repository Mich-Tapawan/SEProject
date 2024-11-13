const express = require("express");
const router = express.Router();
const disneyController = require("../controllers/disneyController");

router.post("/subscribe", disneyController.subscribe);
router.get("/status", disneyController.checkStatus);
router.delete("/unsubscribe", disneyController.unsubscribe);

module.exports = router;
