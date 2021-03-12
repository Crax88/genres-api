const logger = require("../utils/logger");

const error = async (err, req, res, next) => {
  logger.log(err.message, err);
  res.status(500).send("Sorry, something failed.");
};

module.exports = error;
