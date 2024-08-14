const course = require("../models/course.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpSatusText");
const asyncWrapper = require("../middleWares/asyncWrapper");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  let limit = query.limit || 10;
  let page = query.page || 1;
  let skip = (page - 1) * limit;
  let courses = await course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  // const courseId = +req.params.courseId;  + used to force courseId var to be number as it comes from url as string
  const courseId = req.params.courseId;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    const error = appError.create(
      "Invalid course ID",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }
  const recivedCourse = await course.findById(courseId);
  if (!recivedCourse) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { recivedCourse } });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  try {
    let newCourse = new course(req.body);
    let savedCourse = await newCourse.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: savedCourse });
  } catch (err) {
    const error = appError.create(err.message, 401, httpStatusText.FAIL);
    return next(error);
  }
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    const error = appError.create(
      "Invalid course ID",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const existingCourse = await course.findById(courseId);
  if (!existingCourse) {
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  let updatedcourse = await course.updateOne(
    { _id: courseId },
    { $set: { ...req.body } }
  );
  const recivedCourse = await course.findById(courseId);
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updatedcourse, recivedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  // try {
  const courseId = req.params.courseId;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    const error = appError.create(
      "Invalid course ID",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const existingCourse = await course.findById(courseId);
  if (!existingCourse) {
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  let output = await course.deleteOne({ _id: courseId });
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: output });
  // } catch (err) {
  //   return res.status(400).json(err);
  // }
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
