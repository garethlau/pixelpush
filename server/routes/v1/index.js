const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

router.use("/signed-urls", require("./signed-urls"));
router.use("/albums", require("./albums"));
router.use("/auth", require("./auth"));
router.use("/me", auth.enforce, require("./me"));

module.exports = router;
