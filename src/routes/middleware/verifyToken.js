const createError = require("http-errors");
const { getAuth } = require("firebase-admin");

const logger = require("../../../libs/logger");
const { UNAUTHORIZED } = require("../../constants/MESSAGE");

const verifyToken = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session;
    const decodedClaims = await getAuth().verifySessionCookie(
      sessionCookie,
      true
    );

    req.user = decodedClaims;

    next();
  } catch (error) {
    logger.error(error);

    next(createError(401, UNAUTHORIZED));
  }
};

module.exports = verifyToken;
