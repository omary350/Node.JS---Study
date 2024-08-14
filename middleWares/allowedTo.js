const httpStatusText = require("../utils/httpSatusText");
const appErorr = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appErorr.create(
        "this is unauthorized action",
        401,
        httpStatusText.ERROR
      );
      return next(error);
    }
    next();
  };
};
