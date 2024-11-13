const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.post("/subscribe", spotifyController.subscribe);
router.get("/status", spotifyController.checkStatus);
router.delete("/unsubscribe", spotifyController.unsubscribe);

module.exports = router;
