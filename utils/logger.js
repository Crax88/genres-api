require("winston-mongodb");
const config = require("config");
const _ = require("lodash");
const { createLogger, format, transports } = require("winston");
const { timestamp, combine, prettyPrint, colorize } = format;

const insertMetaForWinstonMongo = format((logEntry) => {
  logEntry.metadata = _.chain(logEntry)
    .omit(logEntry, ["level", "message"])
    .omitBy((value, key) => _.isSymbol(key))
    .value();
  return logEntry;
});

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "error.log",
      level: "info",
      format: combine(timestamp(), prettyPrint()),
    }),
    new transports.MongoDB({
      level: "error",
      storeHost: true,
      format: insertMetaForWinstonMongo(),
      capped: true,
      db: config.get("dbUrl"),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    new transports.Console({
      level: "info",
      format: combine(colorize(), prettyPrint()),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      level: "error",
      filename: "uncaughtExceptions.log",
      format: combine(timestamp(), prettyPrint()),
    }),
  ],
});

module.exports = logger;
