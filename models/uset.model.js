const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/users.roles");
const { type } = require("express/lib/response");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "please enter valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER],
    default: userRoles.USER,
  },
});
const user = new mongoose.model("User", userSchema);
module.exports = user;
