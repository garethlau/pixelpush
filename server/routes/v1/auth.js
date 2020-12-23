const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const bcryptjs = require("bcryptjs");
const { sanitizeUser } = require("../../utils/sanitize");

const cookieOptions =
  process.env.NODE_ENV === "production"
    ? {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      }
    : {
        httpOnly: false,
      };

function sendRefreshToken(res, token) {
  res.cookie("app_rtoken", token, cookieOptions);
}
function clearRefreshToken(res) {
  res.clearCookie("app_rtoken", cookieOptions);
}

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Check that we have all the required information, more validation can be added
  if (!email || !password) {
    return res.status(422).send({ message: "Missing fields." });
  }
  try {
    // Check if the user already exists or if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).send({ message: "Email is already in use." });
    }

    // Step 1 - Create and save the user
    const user = await new User({
      firstName,
      lastName,
      email,
      password: password,
      tokenVersion: 0,
    }).save(); // The pre method will run and hash the password before saving

    // Step 2 - Generate access token
    const accessToken = user.generateAccessToken();

    // Step 3 - Generate refresh token
    const refreshToken = user.generateRefreshToken();

    // Step 4 - Send the refresh token
    sendRefreshToken(res, refreshToken);

    // Step 5 - Send the access token (and user)

    const sanitizedUser = sanitizeUser(user);
    return res.status(201).send({ user: sanitizedUser, accessToken });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Step 1 - Check if the username exists
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).send({ message: "User does not exist." });
    }

    // Step 2 - Compare passwords
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    // Step 3 - Generate access token
    const accessToken = await user.generateAccessToken();

    // Step 4 - Generate refresh token
    const refreshToken = await user.generateRefreshToken();

    // Step 5 - Set refresh token
    sendRefreshToken(res, refreshToken);

    // Step 6 - Send access token

    const sanitizedUser = sanitizeUser(user);
    return res.send({ user: sanitizedUser, accessToken });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ err: err.message });
  }
});

router.post("/refresh-token", async (req, res) => {
  // Step 1
  const token = req.cookies.app_rtoken;
  if (!token) {
    return res.status(401).send({ accessToken: "" });
  }
  // Step 2
  try {
    const payload = jwt.verify(token, keys.REFRESH_TOKEN_SECRET);

    // Step 3
    const user = await User.findById(payload.ID).exec();
    if (!user) {
      return res.status(401).send({ accessToken: "" });
    }
    // Step 4
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).send({ accessToken: "" });
    }
    // Step 5
    let accessToken = await user.generateAccessToken();
    let refreshToken = await user.generateRefreshToken();
    sendRefreshToken(res, refreshToken);

    return res.status(201).send({ accessToken });
  } catch (err) {
    // Handle different error codes
    console.log(err.message);
    return res.status(500).send({ accessToken: "" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("app_rtoken", cookieOptions);
  return res.status(200).send();
});

router.post("/logout-all", async (req, res) => {
  const token = req.cookies.app_rtoken;
  if (!token) {
    return res.status(401).send({ message: "No token" });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, keys.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({ message: "Invalid token" });
  }

  try {
    const user = await User.findByIdAndUpdate(payload.ID, {
      $inc: {
        tokenVersion: 1,
      },
    }).exec();

    // Logging updated token version for sanity check
    console.log("User's token version is now: " + user.tokenVersion);
    return res.status(200).send();
  } catch (err) {
    console.log(err.message);
    return res.status(500).send();
  }
});

module.exports = router;
