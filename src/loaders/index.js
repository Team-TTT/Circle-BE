const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("../../libs/logger");
const loadDatabase = require("./database");
const loadHttpServer = require("./server");

const indexRouter = require("../routes/index");

const initLoaders = async (app) => {
  logger.info("app start");

  await loadDatabase();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use("/", indexRouter);

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json(err);
  });

  loadHttpServer(app);
};

module.exports = initLoaders;
