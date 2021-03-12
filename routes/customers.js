const { Router } = require("express");
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const router = Router();

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});
const Customer = model("Customer", customerSchema);

router
  .route("/")
  .get(async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
  })
  .post(async (req, res) => {
    const { error } = await validateCustomer(req.body);
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
    const { error } = await validateCustomer(req.body);
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

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(500).required(),
    phone: Joi.string().min(5).max(500).required(),
    isGold: Joi.boolean(),
  });
  return new Promise((resolve) => {
    const result = schema.validate(customer);
    resolve(result);
  });
}

module.exports = router;
