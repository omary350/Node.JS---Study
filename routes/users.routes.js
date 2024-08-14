const express = require("express");
const usersController = require("../controllers/users.controller");
const router = express.Router();
const schemaValidator = require("../middleWares/validationSchema");
const verifyToken = require("../middleWares/verifyToken");

// get all courses
router.route("/").get(verifyToken, usersController.getAllUsers);
router
  .route("/register")
  .post(schemaValidator.createUserValidation(), usersController.register);
router
  .route("/login")
  .post(schemaValidator.loginValidation(), usersController.login);

module.exports = router;
