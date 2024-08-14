const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpSatusText");
const appErorr = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    const error = appErorr.create(
      "token is required",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.jwtToken);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appErorr.create("invalid token", 401, httpStatusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
