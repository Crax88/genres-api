const mongoose = require("mongoose");
const config = require("config");
const logger = require("../utils/logger");

const connect = () => {
  mongoose
    .connect(config.get("dbUrl"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => logger.info("Connected to MongoDB"));
};

module.exports = connect;
