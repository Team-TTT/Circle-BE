const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("./lib/logger");

const indexRouter = require("./routes/index");

const app = express();
logger.info("app start");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
