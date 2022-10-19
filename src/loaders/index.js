const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");

const logger = require("../../libs/logger");
const loadDatabase = require("./database");
const loadHttpServer = require("./server");
const connectSocket = require("./socket");
const { go } = require("../utils/fp");

const indexRouter = require("../routes/index");

const initLoaders = async (app) => {
  logger.info("app start");

  await loadDatabase();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", indexRouter);

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json(err);
  });

  // eslint-disable-next-line prettier/prettier
  go(
    app,
    loadHttpServer,
    connectSocket
  );
};

module.exports = initLoaders;
