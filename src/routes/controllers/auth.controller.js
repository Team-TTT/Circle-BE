/* eslint-disable camelcase */
const createError = require("http-errors");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { MESSAGE } = require("../../constants");

const { INVALID_INPUT, SUCCESS } = MESSAGE;

const getUser = async (req, res, next) => {
  try {
    const { email } = req.user;

    if (!email) {
      return next(createError(400, `${INVALID_INPUT}: email`));
    }

    const data = await User
      .findOne({ email })
      .lean()
      .populate("projects")
      .exec();

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const findOrCreateUser = async (req, res, next) => {
  try {
    const {
      email,
      displayName,
      photoUrl,
      uid: providerId,
    } = req.body;

    if (!email) {
      return next(createError(400, `${INVALID_INPUT}: email`));
    }

    const existUser = await User
      .findOne({ email })
      .lean()
      .exec();

    if (existUser) {
      return res.json(existUser);
    }

    const newUser = {
      email,
      displayName,
      photoUrl,
      providerId,
    };
    const createdUser = await User.create(newUser);
    logger.info(`(User.create.createdUser) ${JSON.stringify(createdUser)}`);

    return res.json(createdUser);
  } catch (error) {
    return next(error);
  }
};

const deleteSessionCookie = (req, res, next) => {
  res.clearCookie("session");

  return res.json({ result: SUCCESS });
};

module.exports = {
  getUser,
  findOrCreateUser,
  deleteSessionCookie,
};
