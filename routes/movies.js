const { Router } = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncHandler = require("../middleware/async");

const router = Router();

router
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const movies = await Movie.find();
      res.send(movies);
    })
  )
  .post(
    [auth, admin],
    asyncHandler(async (req, res) => {
      const { error } = await validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const genre = await Genre.findById(req.body.genreId);
      if (!genre) return res.status(400).send("Invalid genre");
      const movie = new Movie({
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      });
      await movie.save();
      res.send(movie);
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(400).send("Movie not found");
      res.send(movie);
    })
  )
  .put(
    [auth, admin],
    asyncHandler(async (req, res) => {
      const { error } = await validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const genre = await Genre.findById(req.body.genreId);
      if (!genre) return res.status(400).send("Invalid genre");
      const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          genre: {
            _id: genre._id,
            name: genre.name,
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
        { new: true }
      );
      if (!movie) return res.status(400).send("Movie not found");
      res.send(movie);
    })
  )
  .delete(
    [auth, admin],
    asyncHandler(async (req, res) => {
      const movie = await Movie.findByIdAndRemove(req.params.id);
      if (!movie) return res.status(404).send("Movie not found");
      res.send(movie);
    })
  );

module.exports = router;
