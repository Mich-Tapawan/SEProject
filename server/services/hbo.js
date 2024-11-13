const express = require("express");
const router = express.Router();
const hboController = require("../controllers/hboController");

router.post("/subscribe", hboController.subscribe);
router.get("/status", hboController.checkStatus);
router.delete("/unsubscribe", hboController.unsubscribe);

module.exports = router;
