const express = require("express");
const router = express.Router();

router.use("/signed-urls", require("./signed-urls"));
router.use("/albums", require("./albums"));
router.use("/auth", require("./auth"));

module.exports = router;
