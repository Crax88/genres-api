const Joi = require("joi");
const { Schema, model } = require("mongoose");

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return new Promise((resolve) => {
    const result = schema.validate(genre);
    resolve(result);
  });
}

const Genre = model("Genre", genreSchema);

module.exports = { Genre, validate: validateGenre, genreSchema };
