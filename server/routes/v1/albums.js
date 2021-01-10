const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");

const Album = mongoose.model("Album");
const sizeOf = require("image-size");
const axios = require("axios");
const sharp = require("sharp");

const s3 = require("../../s3");
const { deletePhotos, deletePhoto } = require("../../s3/utils");
const keys = require("../../config/keys");

const auth = require("../../middlewares/auth");
const {
  notifyClients,
  EventTypes,
} = require("../../services/eventSubscription");

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
  const { title, date } = req.body;
  const createdAt = new Date().toString();

  try {
    const code = generateCode();
    const album = await new Album({
      code,
      title,
      date,
      createdBy: ID,
      createdAt,
    }).save();
    return res.status(200).send({ album });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get("/:albumCode/photos", async (req, res) => {
  const { albumCode } = req.params;
  try {
    const album = await Album.findOne({ code: albumCode }).exec();
    if (!album) {
      return res.status(404).send({ message: "Album not found." });
    }
    const photos = album.photos;
    if (!photos) {
      return res.status(200).send({ urls: [] });
    }

    const photosWithSignedUrl = photos.map((photo) => {
      const previewUrl = s3.getSignedUrl("getObject", {
        Key: photo.key + "-preview",
        Bucket: keys.S3_BUCKET_NAME,
      });

      const url = s3.getSignedUrl("getObject", {
        Key: photo.key,
        Bucket: keys.S3_BUCKET_NAME,
      });
      photo.url = url;
      photo.previewUrl = previewUrl;
      return photo;
    });

    return res.status(200).send({ photos: photosWithSignedUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.delete("/:albumCode", auth.enforce, async (req, res) => {
  const { albumCode } = req.params;
  const { ID } = req.payload;

  try {
    // Check if this user is permitted to delete the album
    const album = await Album.findOne({ code: albumCode }).exec();

    if (!album) {
      return res.status(404).send({ message: "Album not found." });
    }

    if (album.createdBy !== ID) {
      return res
        .status(403)
        .send({ message: "You do not have permissions to delete this album." });
    }

    const keys = album.photos.map((photo) => photo.key);
    if (keys.length > 0) {
      await deletePhotos(keys);
    }

    // Delete the album from mongo
    await album.delete();

    // Notify clients
    notifyClients(albumCode, EventTypes.ALBUM_DELETED);

    return res.status(200).send({ message: "Album deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.put("/:albumCode/photos", auth.enforce, async (req, res) => {
  const { albumCode } = req.params;
  const { key, type, name, size } = req.body;
  const { ID } = req.payload;

  const params = {
    Key: key,
    Bucket: keys.S3_BUCKET_NAME,
  };
  const signedUrl = s3.getSignedUrl("getObject", params);
  try {
    const response = await axios.get(signedUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "binary");
    // Determine the image dimensions
    const dimensions = sizeOf(buffer);
    const { height, width } = dimensions;

    // Resize the image for preview
    const resizedBuffer = await sharp(buffer)
      .jpeg({
        quality: 80,
      })
      .resize(480)
      .toBuffer();

    await s3
      .putObject({
        Body: resizedBuffer,
        Bucket: keys.S3_BUCKET_NAME,
        Key: key + "-preview",
      })
      .promise();

    const album = await Album.findOne({ code: albumCode }).exec();
    const photos = album.photos;

    let newPhoto = { key, width, height, uploadedBy: ID, size, type, name };

    album.photos = [...photos, newPhoto];
    const updatedAlbum = await album.save();

    // Notify clients
    notifyClients(albumCode, EventTypes.IMAGE_LIST_UPDATED);

    return res.status(200).send({ album: updatedAlbum });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.delete("/:albumCode/photos/:key", auth.enforce, async (req, res) => {
  const { ID } = req.payload;
  const { albumCode, key } = req.params;
  try {
    const album = await Album.findOne({ code: albumCode }).exec();
    if (!album) {
      return res.status(404).send({ message: "Resource not found." });
    }

    // Check if this user is permitted to remove this photo
    let permitted = false;
    if (album.createdBy === ID) {
      // The authenticated user is the creator the album and is able to delete the photo
      permitted = true;
    }

    const photoToDelete = album.photos.find((photo) => photo.key === key);
    if (photoToDelete.uploadedBy === ID) {
      // The photo was uploaded by the authenticated user
      // Is able to delete the photo
      permitted = true;
    }

    if (!permitted) {
      return res.status(403).send({
        message: "You do not have permission to modify this resource.",
      });
    }

    // Remove the object from S3
    await deletePhoto(key);

    // Remove the photo from the album
    album.photos = album.photos.filter((photo) => photo.key !== key);

    // Save the new album
    const updatedAlbum = await album.save();

    // Notify clients
    notifyClients(albumCode, EventTypes.IMAGE_LIST_UPDATED);

    return res.status(200).send({ album: updatedAlbum });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
