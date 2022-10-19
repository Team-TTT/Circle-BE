const createError = require("http-errors");
const { admin } = require("../../../configs/firebase.config");

const logger = require("../../../libs/logger");
const { UNAUTHORIZED } = require("../../constants");

const verifyToken = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session;
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    req.user = decodedClaims;

    next();
  } catch (error) {
    logger.error(error.toString());

    next(createError(401, UNAUTHORIZED));
  }
};

module.exports = verifyToken;
