const User = require("../../../models/User");

const logger = require("../../../libs/logger");

const findOrCreateUser = async (req, res, next) => {
  try {
    const { email, displayName } = req.body;
    const profileUrl = req.body.profile_url;

    const existUser = await User.findOne({ email }).lean().exec();

    if (existUser) {
      return res.json(existUser);
    }

    const newUser = {
      email,
      displayName,
      profileUrl,
    };
    const createdUser = await User.create(newUser);

    return res.json(createdUser);
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

module.exports = {
  findOrCreateUser,
};
