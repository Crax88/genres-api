const { Router } = require("express");
const _ = require("lodash");
const { User, validate } = require("../models/user");

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    const users = await User.find().sort({ name: 1 });
    res.send(users);
  })
  .post(async (req, res) => {
    const { error } = await validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already exists");
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    await user.save();

    res.send(_.pick(user, ["_id", "name", "email"]));
  });

module.exports = router;
