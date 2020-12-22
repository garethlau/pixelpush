const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  code: String,
  title: String,
  geo: String,
  photos: Array,
  createdBy: String,
});

module.exports = mongoose.model("Album", AlbumSchema);
