const keys = require("../config/keys");
const s3 = require("./index");

async function deletePhoto(key) {
  const params = {
    Bucket: keys.S3_BUCKET_NAME,
    Delete: {
      Quiet: false,
      Objects: [{ Key: key }, { Key: key + "-preview" }],
    },
  };
  const result = await s3.deleteObjects(params).promise();
  return result;
}
async function deletePhotos(k) {
  let objects = [];
  k.forEach((key) => {
    objects.push({ Key: key });
    objects.push({ Key: key + "-preview" });
  });
  const params = {
    Bucket: keys.S3_BUCKET_NAME,
    Delete: {
      Quiet: false,
      Objects: objects,
    },
  };

  const result = await s3.deleteObjects(params).promise();
  return result;
}

module.exports = {
  deletePhoto,
  deletePhotos,
};
