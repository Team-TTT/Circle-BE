const createError = require("http-errors");
const { admin } = require("../../../configs/firebase.config");

const logger = require("../../../libs/logger");
const { MESSAGE } = require("../../constants");

const { UNAUTHORIZED } = MESSAGE;

const createSessionCookie = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      const error = createError(401, UNAUTHORIZED);
      logger.error(error.toString());

      return next(error);
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(token, {
      expiresIn,
    });
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };

    res.cookie("session", sessionCookie, options);

    return next();
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

module.exports = createSessionCookie;
