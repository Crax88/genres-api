const jwt = require("jsonwebtoken");
const config = require("config");

const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Acces denied. No authentication provided");

  try {
    const decoded = await jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};

module.exports = auth;
