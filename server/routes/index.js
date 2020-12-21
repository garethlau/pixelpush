const express = require("express");
const router = express.Router();

router.get("/api/health", (_, res) => {
  return res.status(200).send({ message: "Server is healthy." });
});
router.use("/api/v1", require("./v1"));

module.exports = router;
