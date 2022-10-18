const createError = require("http-errors");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { INVALID_INPUT } = require("../../constants/MESSAGE");

const findOrCreateUser = async (req, res, next) => {
  try {
    const { email, displayName, profile_url: profileUrl } = req.body;

    if (!email) {
      const error = createError(400, `${INVALID_INPUT}: email`);
      logger.error(error.toString());

      return next(error);
    }

    const existUser = await User.findOne({ email }).lean().exec();

    if (existUser) {
      return res.status(200).json(existUser);
    }

    const newUser = {
      email,
      displayName,
      profileUrl,
    };
    const createdUser = await User.create(newUser);
    logger.info(`(User.create.createdUser) ${JSON.stringify(createdUser)}`);

    return res.status(200).json(createdUser);
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

module.exports = {
  findOrCreateUser,
};
