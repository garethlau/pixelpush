const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose
  .connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to mongo");
  })
  .catch((error) => {
    console.log("Error connecting to mongo ", error);
  });

require("./models/Album");
require("./models/User");
