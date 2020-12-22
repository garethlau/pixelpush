// \server\middlewares\index.js
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = {
  enforce: async (req, res, next) => {
    // Step 1
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).send();
    }
    // Step 2
    try {
      const token = authorization.split(" ")[1];
      const payload = jwt.verify(token, keys.ACCESS_TOKEN_SECRET);
      // Step 3
      req.payload = payload;
      next();
    } catch (err) {
      // Add error handling
      console.log(err.message);
      return res.status(401).send();
    }
  },
};
