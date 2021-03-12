const error = async (err, req, res, next) => {
  res.status(500).send("Sorry, something failed.");
};

module.exports = error;
