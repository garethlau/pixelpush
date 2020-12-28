const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const { subscribe } = require("./services/eventSubscription");
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

const whitelist = ["http://localhost:3000", "http://localhost:5000/"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Origin '${origin}' not allowed by cors`));
    }
  },
};

const app = express();
require("./mongo");

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(require("./routes"));
app.get("/subscribe/:albumCode", subscribe);

app.listen(PORT, () => {
  if (NODE_ENV === "production") {
    console.log("RUNNING IN PRODUCTION ENV");
    app.use(express.static(path.join(__dirname, "..", "client", "build")));
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });
  }
  console.log("Listening on port " + PORT);
});
