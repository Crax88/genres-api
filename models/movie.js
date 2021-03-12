const { Schema, model } = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return new Promise((resolve) => {
    const result = schema.validate(movie);
    resolve(result);
  });
}

const Movie = model("Movie", movieSchema);

module.exports = { Movie, validate: validateMovie };
