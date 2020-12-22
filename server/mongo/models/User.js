// \server\models\User.js
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const keys = require("../../config/keys");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

UserSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.generateAccessToken = function () {
  const user = this;
  const accessToken = jwt.sign({ ID: user._id }, keys.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
  return accessToken;
};

UserSchema.methods.generateRefreshToken = function () {
  const user = this;
  const tokenVersion = user.tokenVersion || 0;
  const refreshToken = jwt.sign(
    { ID: user._id, tokenVersion },
    keys.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

module.exports = mongoose.model("User", UserSchema);
