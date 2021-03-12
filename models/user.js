const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.methods.createAuthToken = function () {
  const that = this;
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign({ _id: that._id }, config.get("jwtPrivateKey"));
      resolve(token);
    } catch (error) {
      reject();
    }
  });
};

const User = model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.validatePassword(),
  });
  return new Promise((resolve) => {
    const result = schema.validate(user);
    resolve(result);
  });
}

module.exports = { User, validate: validateUser };
