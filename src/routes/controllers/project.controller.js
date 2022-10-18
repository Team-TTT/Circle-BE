const createError = require("http-errors");
const Project = require("../../../models/Project");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { generateDbSecretKey } = require("../../utils/crypto");
const { MESSAGE, LIMITED_PROJECT_COUNT } = require("../../constants");

const { LIMITED_PROJECT } = MESSAGE;

const createProject = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { _id: userId, projects: userProjects } = req.user;
    const projectCount = userProjects.length;

    if (projectCount > LIMITED_PROJECT_COUNT) {
      return next(createError(423, LIMITED_PROJECT));
    }

    const newProject = {
      secret_key: generateDbSecretKey(),
      owner: userId,
      title,
    };

    const { _id: projectId } = await Project.create(newProject);
    await User.findByIdAndUpdate(userId, { $push: { projects: projectId } });

    return res.json({ _id: projectId });
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

module.exports = {
  createProject,
};
