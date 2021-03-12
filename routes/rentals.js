const { Router } = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

Fawn.init(mongoose);
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
  })
  .post(async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie not found");
    if (movie.numberInStock === 0) res.status(400).send("Movie not in stock");
    let rental = new Rental({
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
    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run();

      res.send(rental);
    } catch (err) {
      return res.status(500).send("Something failed");
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(400).send("Rental not found");
    res.send(rental);
  })
  .put(async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie not found");
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(400).send("Invalid rental");
    try {
      new Fawn.Task()
        .update(
          "rentals",
          { _id: rental._id },
          { $set: { dateReturned: Date.now() } }
        )
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: 1 } })
        .run();

      res.send(rental);
    } catch (err) {
      return res.status(500).send("Something failed");
    }
  })
  .delete(async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send("Rental not found");
    res.send(rental);
  });

module.exports = router;
