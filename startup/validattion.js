const Joi = require("joi");

module.exports = () => {
  Joi.objectId = require("joi-objectid")(Joi);
  Joi.validatePassword = require("joi-password-complexity");
};
