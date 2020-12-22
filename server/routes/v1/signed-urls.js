const express = require("express");
const router = express.Router();
const s3 = require("../../s3");
const keys = require("../../config/keys");

const auth = require("../../middlewares/auth");

router.post("/", auth.enforce, async (req, res) => {
  const { key } = req.body;
  const params = {
    Key: key,
    Bucket: keys.S3_BUCKET_NAME,
  };
  try {
    const url = s3.getSignedUrl("putObject", params);
    return res.status(200).send({ signedUrl: url });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
