const { body } = require("express-validator");

const validationScema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 4 })
      .withMessage("title length 4 char at least"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isLength({ min: 3 })
      .withMessage("price 3 numbers at least"),
  ];
};

const createUserValidation = () => {
  return [
    body("firstName").notEmpty().withMessage("first name is required"),

    body("lastName").notEmpty().withMessage("last name is required"),

    body("email").notEmpty().withMessage("email is required"),

    body("password").notEmpty().withMessage("password is required"),
  ];
};

const loginValidation = () => {
  return [
    body("email").notEmpty().withMessage("email is required"),

    body("password").notEmpty().withMessage("password is required"),
  ];
};

module.exports = {
  validationScema,
  createUserValidation,
  loginValidation,
};
