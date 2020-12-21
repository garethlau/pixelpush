const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");

const Album = mongoose.model("Album");

function generateCode() {
  let result = "";
  for (let i = 0; i < 3; i++) {
    if (i !== 0) result += "-";
    const buf = crypto.randomBytes(2);
    const section = buf.toString("hex").toUpperCase();
    result += section;
  }
  return result;
}

router.post("/", async (req, res) => {
  const { title, geo } = req.body;
  try {
    const code = generateCode();
    const album = await new Album({ code, title, geo }).save();
    return res.status(200).send({ album });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/:albumCode", async (req, res) => {
  const { albumCode } = req.params;
  try {
    const album = await Album.findOne({ code: albumCode }).exec();
    if (!album) {
      return res.status(404).send({ message: "Album not found." });
    }
    return res.status(200).send({ album });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
