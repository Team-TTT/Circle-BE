const mongoose = require("mongoose");
const createError = require("http-errors");
const Project = require("../../../models/Project");
const User = require("../../../models/User");

const logger = require("../../../libs/logger");
const { generateDbSecretKey, getUserSecretKey } = require("../../utils/crypto");
const { MESSAGE, LIMITED_PROJECT_COUNT } = require("../../constants");

const { LIMITED_PROJECT, BAD_REQUEST, SUCCESS } = MESSAGE;

const getAllProjects = async (req, res, next) => {
  try {
    const { providerId } = req.user;

    if (!mongoose.isValidObjectId(providerId) || !providerId) {
      return next(createError(400, BAD_REQUEST));
    }

    const data = await User
      .findOne({ providerId })
      .lean()
      .populate("projects")
      .exec();

    return res.json(data.projects);
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { providerId, projects: userProjects } = req.user;
    const projectCount = userProjects.length;

    if (projectCount > LIMITED_PROJECT_COUNT) {
      return next(createError(423, LIMITED_PROJECT));
    }

    const newProject = {
      secret_key: generateDbSecretKey(),
      owner: providerId,
      title,
    };

    const { _id: projectId } = await Project.create(newProject);
    await User.findOneAndUpdate(
      { providerId },
      { $push: { projects: projectId } },
    );

    return res.json({ _id: projectId });
  } catch (error) {
    return next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { providerId } = req.user;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(createError(400, BAD_REQUEST));
    }

    const project = await Project
      .findOne({ _id: projectId, owner: providerId })
      .lean()
      .exec();

    project.secret_key = getUserSecretKey(project.secret_key);

    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

const editProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;
    const { providerId } = req.user;

    if (!mongoose.isValidObjectId(projectId) || title === undefined) {
      return next(createError(400, BAD_REQUEST));
    }

    await Project.findOneAndUpdate({ projectId, owner: providerId }, { title })
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
    const { providerId } = req.user;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(createError(400, BAD_REQUEST));
    }

    await session.withTransaction(async () => {
      await Project.deleteOne({ projectId, owner: providerId }, { session });
      await User.findByOneAndUpdate(
        { providerId },
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
  getProject,
  editProject,
  deleteProject,
};
