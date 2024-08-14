const express = require("express");
const mongoose = require("mongoose");
const httpSatusText = require("./utils/httpSatusText");
const coursesRouter = require("./routes/courses.routes");
const usersRouter = require("./routes/users.routes");
require("dotenv").config();
mongoose.connect(process.env.dbURL).then(() => {
  console.log("connected succesfully");
});

const app = express();
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.all("*", (req, res) => {
  return res.status(404).json({
    status: httpSatusText.ERROR,
    message: "this resource is not availabe",
  });
});

app.use((error, req, res, next) => {
  res
    .status(error.statusCode)
    .json({ status: error.statusText, message: error.message });
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
