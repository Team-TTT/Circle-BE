const mongoose = require("mongoose");
const createError = require("http-errors");
const Project = require("../../../models/Project");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { LIMITED_PROJECT } = require("../../constants/MESSAGE");
const { generateSecretDbKey } = require("../../utils/crypto");

const saveProject = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { _id: userId, projects: userProjects } = req.user;
    const projectCount = userProjects.length;

    if (projectCount > 2) {
      return next(createError(423, LIMITED_PROJECT));
    }

    const projectId = mongoose.Types.ObjectId();
    const secretDbKey = generateSecretDbKey();

    const newProject = {
      _id: projectId,
      secret_key: secretDbKey,
      owner: userId,
      title,
    };

    await Project.create(newProject);
    await User.findByIdAndUpdate(userId, { $push: { projects: projectId } });

    return res.status(200).json({ _id: projectId });
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

module.exports = {
  saveProject,
};
