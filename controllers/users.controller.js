const user = require("../models/uset.model");
const asyncWrapper = require("../middleWares/asyncWrapper");
const httpStatusText = require("../utils/httpSatusText");
const appErorr = require("../utils/appError");
const pycrpt = require("bcryptjs");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  let limit = query.limit || 10;
  let page = query.page || 1;
  let skip = (page - 1) * limit;
  let users = await user
    .find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appErorr.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await user.findOne({ email: email });
  if (oldUser) {
    const error = appErorr.create(
      "user already exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  //hashing password
  hashedPass = await pycrpt.hash(password, 10);

  const newUser = new user({
    firstName,
    lastName,
    email,
    password: hashedPass,
    role,
  });

  const token = await generateToken({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  try {
    const ifsaved = await newUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: ifsaved });
  } catch (err) {
    const error = appErorr.create(err.message, 400, httpStatusText.FAIL);
    return next(error);
  }
});

const login = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appErorr.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const { email, password } = req.body;
  const ifexist = await user.findOne({ email: email });
  if (!ifexist) {
    const error = appErorr.create("user not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  const matchPassword = await pycrpt.compare(password, ifexist.password);

  if (matchPassword) {
    const token = await generateToken({
      email: ifexist.email,
      id: ifexist._id,
      role: ifexist.role,
    });
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appErorr.create("wrong password", 400, httpStatusText.FAIL);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
