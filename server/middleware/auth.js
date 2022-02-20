const config = require("../config/config");
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"] || null;
  if (!authorization) {
    return res
      .status(403)
      .send({ status: false, message: "Token is required for authentication" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, config.TOKEN_SECRET, (err, payload) => {
    if (err)
      return res.status(401).send({ status: false, message: "Invalid Token" });
    req.payload = payload;
  });
  return next();
};

module.exports = verifyToken;
