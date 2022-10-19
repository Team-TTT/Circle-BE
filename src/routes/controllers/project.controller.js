const mongoose = require("mongoose");
const createError = require("http-errors");
const Project = require("../../../models/Project");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { generateDbSecretKey } = require("../../utils/crypto");
const { MESSAGE, LIMITED_PROJECT_COUNT } = require("../../constants");

const { LIMITED_PROJECT, BAD_REQUEST, SUCCESS } = MESSAGE;

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

const editProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;

    if (!mongoose.isValidObjectId(projectId) || title === undefined) {
      return next(createError(400, BAD_REQUEST));
    }

    await Project.findByIdAndUpdate(projectId, { title });

    return res.json({ result: SUCCESS });
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(createError(400, BAD_REQUEST));
    }

    await Project.deleteOne({ _id: projectId, owner: userId });
    await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } });

    return res.json({ result: SUCCESS });
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

module.exports = {
  createProject,
  editProject,
  deleteProject,
};
