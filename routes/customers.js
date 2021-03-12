const { Router } = require("express");
const { Customer, validate } = require("../models/customer");

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
  })
  .post(async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    customer = await customer.save();
    res.send(customer);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");
    return res.send(customer);
  })
  .put(async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
      { new: true }
    );
    if (!customer) return res.status(404).send("Customer not found");
    res.send(customer);
  })
  .delete(async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");
    res.send(customer);
  });

module.exports = router;
