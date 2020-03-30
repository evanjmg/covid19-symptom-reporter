const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const mongoose = require("mongoose");
const path = require("path");
const { secret } = require("./config/config");
const port = process.env.PORT || 4000;
const databaseURL =
  process.env.MONGODB_URI || "mongodb://localhost:27017/coronaDB";
mongoose.connect(databaseURL);

const routes = require("./routes");
const app = express();
app.use(express.static(path.join(__dirname, "../build")));

app.use("/node_modules", express.static(__dirname + "../node_modules"));
app.use(compression());
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json({ extended: false }));

const expressJWT = require("express-jwt");

app.use(
  "/api",
  expressJWT({ secret }).unless({
    path: ["/api/records"],
    method: ["post"]
  })
);
app.use("/api", routes);

app.get("/privacy", function(_, res) {
  res.sendFile(path.join(__dirname, "../public", "privacy-policy.html"));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port, () => console.log("listening:" + port));
