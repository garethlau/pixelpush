const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { sanitizeUser } = require("../../utils/sanitize");

router.get("/", async (req, res) => {
  const { ID } = req.payload;
  try {
    const user = await User.findById(ID).exec();
    if (!user) {
      return res.status(404).send({ user: null });
    }
    const sanitizedUser = sanitizeUser(user);
    return res.status(200).send({ user: sanitizedUser });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
