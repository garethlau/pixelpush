const express = require("express");
const router = express.Router();

router.use("/signed-urls", require("./signed-urls"));
router.use("/albums", require("./albums"));

module.exports = router;
