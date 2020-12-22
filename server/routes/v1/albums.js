const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");

const Album = mongoose.model("Album");
const sizeOf = require("image-size");
const axios = require("axios");

const s3 = require("../../s3");
const keys = require("../../config/keys");

const auth = require("../../middlewares/auth");

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

router.post("/", auth.enforce, async (req, res) => {
  const { ID } = req.payload;
  const { title, geo } = req.body;
  try {
    const code = generateCode();
    const album = await new Album({ code, title, geo, createdBy: ID }).save();
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

    const photosWithSignedUrl = photos.map((photo) => {
      const params = {
        Key: photo.key,
        Bucket: keys.S3_BUCKET_NAME,
      };
      const url = s3.getSignedUrl("getObject", params);
      photo.url = url;
      return photo;
    });

    return res.status(200).send({ photos: photosWithSignedUrl });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put("/:albumCode/photos", auth.enforce, async (req, res) => {
  const { albumCode } = req.params;
  const { key } = req.body;
  const { ID } = req.payload;

  const params = {
    Key: key,
    Bucket: keys.S3_BUCKET_NAME,
  };
  const signedUrl = s3.getSignedUrl("getObject", params);
  try {
    // Determine the image dimensions
    const response = await axios.get(signedUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "binary");
    const dimensions = sizeOf(buffer);
    const { height, width } = dimensions;

    const album = await Album.findOne({ code: albumCode }).exec();
    const photos = album.photos;
    album.photos = [...photos, { key, width, height, userId: ID }];
    const updatedAlbum = await album.save();
    return res.status(200).send({ album: updatedAlbum });
  } catch (error) {
    return res.status(500).send(error);
  }
});
module.exports = router;
