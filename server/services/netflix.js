const express = require("express");
const router = express.Router();
const netflixController = require("../controllers/netflixController");

router.post("/subscribe", netflixController.subscribe);
router.get("/status", netflixController.checkStatus);
router.delete("/unsubscribe", netflixController.unsubscribe);

module.exports = router;
