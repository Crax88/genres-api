const { Router } = require("express");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const router = Router();

router.route("/").post(async (req, res) => {
  const { error } = await validateReq(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  res.send(true);
});

function validateReq(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return new Promise((resolve) => {
    const result = schema.validate(req);
    resolve(result);
  });
}

module.exports = router;
