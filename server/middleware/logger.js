const requestLogger = (req, res, next) => {
  console.log("Request", req.body);
  next();
};

const responseLogger = (req, res, next) => {
  console.log("Response", res);
  next();
};

module.exports = { requestLogger, responseLogger };
