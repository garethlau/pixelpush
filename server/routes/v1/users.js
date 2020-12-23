const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send({ user: null });
    }
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
