const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");

const Album = mongoose.model("Album");

const s3 = require("../../s3");
const keys = require("../../config/keys");

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

router.get("/:albumCode/photos", async (req, res) => {
  const { albumCode } = req.params;
  try {
    const album = await Album.findOne({ code: albumCode }).exec();
    const photos = album.photos;
    if (!photos) {
      return res.status(200).send({ urls: [] });
    }

    const signedUrls = photos.map((key) => {
      const params = {
        Key: key,
        Bucket: keys.S3_BUCKET_NAME,
      };
      const url = s3.getSignedUrl("getObject", params);
      return url;
    });

    return res.status(200).send({ urls: signedUrls });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put("/:albumCode/photos", async (req, res) => {
  const { albumCode } = req.params;
  const { key } = req.body;
  try {
    const album = await Album.findOne({ code: albumCode }).exec();
    const photos = album.photos;
    album.photos = [...photos, key];
    const updatedAlbum = await album.save();
    return res.status(200).send({ album: updatedAlbum });
  } catch (error) {
    return res.status(500).send(error);
  }
});
module.exports = router;
