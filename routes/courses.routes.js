const express = require("express");
const coursesController = require("../controllers/courses.controller");
const schemaValidator = require("../middleWares/validationSchema");
const verifyToken = require("../middleWares/verifyToken");
const userRoles = require("../utils/users.roles");
const allowedTo = require("../middleWares/allowedTo");
const router = express.Router();

// get all courses
router
  .route("/")
  .get(verifyToken, coursesController.getAllCourses)
  .post(schemaValidator.validationScema(), coursesController.addCourse);

// get specific course
router
  .route("/:courseId")
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteCourse
  );

module.exports = router;
