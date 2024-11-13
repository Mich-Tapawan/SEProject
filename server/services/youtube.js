const express = require("express");
const router = express.Router();
const youtubeController = require("../controllers/youtubeController");

router.post("/subscribe", youtubeController.subscribe);
router.get("/status", youtubeController.checkStatus);
router.delete("/unsubscribe", youtubeController.unsubscribe);

module.exports = router;
