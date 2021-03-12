const { Router } = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncHandler = require("../middleware/async");

Fawn.init(mongoose);
const router = Router();

router
  .route("/")
  .get(
    [auth, admin],
    asyncHandler(async (req, res) => {
      const rentals = await Rental.find().sort({ dateOut: -1 });
      res.send(rentals);
    })
  )
  .post(
    auth,
    asyncHandler(async (req, res) => {
      const { error } = await validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const customer = await Customer.findById(req.body.customerId);
      if (!customer) return res.status(400).send("Invalid customer");
      const movie = await Movie.findById(req.body.movieId);
      if (!movie) return res.status(400).send("Movie not found");
      if (movie.numberInStock === 0) res.status(400).send("Movie not in stock");
      const rental = new Rental({
        customer: {
          _id: customer._id,
          name: customer.name,
          phone: customer.phone,
          isGold: customer.isGold,
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
      });

      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run();

      res.send(rental);
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const rental = await Rental.findById(req.params.id);
      if (!rental) return res.status(400).send("Rental not found");
      res.send(rental);
    })
  )
  .put(
    [auth, admin],
    asyncHandler(async (req, res) => {
      const { error } = await validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const customer = await Customer.findById(req.body.customerId);
      if (!customer) return res.status(400).send("Invalid customer");
      const movie = await Movie.findById(req.body.movieId);
      if (!movie) return res.status(400).send("Movie not found");
      const rental = await Rental.findById(req.params.id);
      if (!rental) return res.status(400).send("Invalid rental");
      new Fawn.Task()
        .update(
          "rentals",
          { _id: rental._id },
          { $set: { dateReturned: Date.now() } }
        )
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: 1 } })
        .run();

      res.send(rental);
    })
  )
  .delete(
    [auth, admin],
    asyncHandler(async (req, res) => {
      const rental = await Rental.findByIdAndRemove(req.params.id);
      if (!rental) return res.status(404).send("Rental not found");
      res.send(rental);
    })
  );

module.exports = router;
