const mongoose = require("mongoose");
const logger = require("../../libs/logger");

const loadDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose.connection.on("error", (error) => {
      logger.error(`Connection error: ${error.toString()}`);
    });

    mongoose.connection.once("disconnected", () => {
      logger.info("MongoDB disconnected");
    });

    mongoose.connect(
      process.env.MONGODB_SECRET_STRING,
      { dbName: process.env.MONGODB_DB_NAME },
      (error) => {
        if (error) {
          logger.error("MongoDB initial connection failed");
          reject();
        } else {
          logger.info("Successfully connected to mongoDB");
          resolve();
        }
      }
    );
  });
};

module.exports = loadDatabase;
