const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/", async (req, res) => {
  const { ID } = req.payload;
  try {
    const user = await User.findById(ID).exec();
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
