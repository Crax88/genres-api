const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  debug("Morgan enabled...");
}

app.get("/", (req, res) => {
  res.send({ message: "Server is working" });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
