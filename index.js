const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
Joi.validatePassword = require("joi-password-complexity");
const debug = require("debug")("app:startup");
const config = require("config");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const connectDb = require("./db/connect");

if (!config.get("jwtPrivateKey")) {
  console.error("JWT Private Key is not defined");
  process.exit(1);
}
connectDb();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  debug("Morgan enabled...");
}

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
