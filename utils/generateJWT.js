const jwt = require("jsonwebtoken");

module.exports = async (paylioad) => {
  const token = await jwt.sign(paylioad, process.env.jwtToken, {
    expiresIn: "1m",
  });
  return token;
};
