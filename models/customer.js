const { Schema, model } = require("mongoose");
const Joi = require("joi");

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

const Customer = model("Customer", customerSchema);

module.exports = { Customer, validate: validateCustomer };
