const { createLogger, format, transports } = require("winston");
const { timestamp, combine } = format;

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "error.log",
      level: "error",
      format: combine(timestamp(), format.json()),
      options: {},
    }),
  ],
});

module.exports = logger;
