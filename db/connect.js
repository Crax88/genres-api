const mongoose = require("mongoose");
const config = require("config");
const debug = require("debug")("app:db");

const connect = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    debug("Connected to MongoDB");
  } catch (error) {
    debug(`DB connect error: ${error.message}`);
  }
};

module.exports = connect;
