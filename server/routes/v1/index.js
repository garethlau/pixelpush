const express = require("express");
const router = express.Router();

router.use("/albums", require("./albums"));

module.exports = router;
