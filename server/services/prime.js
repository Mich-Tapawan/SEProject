const express = require("express");
const router = express.Router();
const primeRouter = require("../controllers/primeController");

router.post("/subscribe", primeRouter.subscribe);
router.get("/status", primeRouter.checkStatus);
router.delete("/delete", primeRouter.unsubscribe);

module.exports = router;
