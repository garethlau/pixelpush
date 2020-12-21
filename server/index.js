const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.ENVIRONMENT;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./routes"));

app.listen(PORT, () => {
  if (ENVIRONMENT === "production") {
    app.use(express.static(path.join(__dirname, "..", "client", "build")));
    app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });
  }
  console.log("Listening on port " + PORT);
});
