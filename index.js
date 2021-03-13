const express = require("express");
const app = express();
const logger = require("./utils/logger");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/connectDB")();
require("./startup/config")();
require("./startup/validattion")();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
