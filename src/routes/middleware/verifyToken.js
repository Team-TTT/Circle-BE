const { getAuth } = require("firebase-admin");
const logger = require("../../../libs/logger");

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

    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;
