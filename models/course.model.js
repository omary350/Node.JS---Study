const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    match: [
      /^[A-Za-z\s]+$/,
      "Title must only contain alphabetic characters and spaces.",
    ],
  },
  price: {
    type: Number,
    required: true,
  },
});
const course = mongoose.model("course", courseSchema);
module.exports = course;
