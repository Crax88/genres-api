const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: Stirng,
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

const User = model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Join.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return new Promise((resolve) => {
    const result = schema.validate(user);
    resolve(result);
  });
}

module.exports = { User, validate: validateUser };
