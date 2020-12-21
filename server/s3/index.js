const AWS = require("aws-sdk");
const keys = require("../config/keys");

AWS.config.update({
  accessKeyId: keys.AWS_SECRET_KEY_ID,
  secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "us-east-2",
});

const s3 = new AWS.S3();
module.exports = s3;
