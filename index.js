const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send({ message: "Server is working" });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
