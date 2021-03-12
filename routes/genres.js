const { Router } = require("express");
const Joi = require("joi");
const { Schema, model } = require("mongoose");

const router = Router();

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = model("Genre", genreSchema);

router
  .route("/")
  .get(async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
  })
  .post(async (req, res) => {
    const { error } = await validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    return res.send(genre);
  })
  .put(async (req, res) => {
    const { error } = await validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  })
  .delete(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
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

module.exports = router;
