const { Router } = require("express");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
  })
  .post(auth, async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    return res.send(genre);
  })
  .put(auth, async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  })
  .delete(auth, async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  });

module.exports = router;
