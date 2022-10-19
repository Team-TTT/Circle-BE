const mongoose = require("mongoose");
const createError = require("http-errors");
const Project = require("../../../models/Project");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { generateDbSecretKey } = require("../../utils/crypto");
const { MESSAGE, LIMITED_PROJECT_COUNT } = require("../../constants");

const { LIMITED_PROJECT, BAD_REQUEST, SUCCESS } = MESSAGE;

const getAllProjects = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    if (!mongoose.isValidObjectId(userId) || !userId) {
      return next(createError(400, BAD_REQUEST));
    }

    const data = await User
      .findById(userId)
      .lean()
      .populate("projects")
      .exec();

    return res.json(data);
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

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
    const { _id: userId } = req.user;

    if (!mongoose.isValidObjectId(projectId) || title === undefined) {
      return next(createError(400, BAD_REQUEST));
    }

    await Project.findOneAndUpdate({ _id: projectId, owner: userId }, { title })
      .lean()
      .exec();

    return res.json({ result: SUCCESS });
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { projectId } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(createError(400, BAD_REQUEST));
    }

    await session.withTransaction(async () => {
      await Project.deleteOne({ _id: projectId, owner: userId }, { session });
      await User.findByIdAndUpdate(
        userId,
        { $pull: { projects: projectId } },
        { session },
      );
    });

    return res.json({ result: SUCCESS });
  } catch (error) {
    logger.error(error.toString());

    return next(error);
  } finally {
    session.endSession();
  }
};

module.exports = {
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
};
