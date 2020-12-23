const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  code: String,
  title: String,
  date: String,
  photos: Array,
  createdBy: String,
  createdAt: String,
});

module.exports = mongoose.model("Album", AlbumSchema);
