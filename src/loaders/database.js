const mongoose = require("mongoose");

const logger = require("../../libs/logger");

const loadDatabase = async () => {
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
        logger.error(`Connecting error: ${error.toString()}`);

        throw new Error("MongoDB initial connection failed");
      } else {
        logger.info("Successfully connected to mongoDB");
      }
    },
  );
};

module.exports = loadDatabase;
