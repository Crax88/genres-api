const logger = require("../utils/logger");

module.exports = () => {
  process.on("uncaughtException", async (ex) => {
    logger.error(ex.message, ex);
    process.exit(1);
  });
  process.on("unhandledRejection", async (ex) => {
    throw ex;
  });
};
