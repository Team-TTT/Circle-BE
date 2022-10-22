const mongoose = require("mongoose");
const createError = require("http-errors");
const Project = require("../../../models/Project");
const User = require("../../../models/User");

const { generateDbSecretKey, getUserSecretKey } = require("../../utils/crypto");
const { MESSAGE, LIMITED_PROJECT_COUNT } = require("../../constants");

const { LIMITED_PROJECT, BAD_REQUEST, SUCCESS } = MESSAGE;

const getAllProjects = async (req, res, next) => {
  try {
    const { projects } = req.user;
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const projectId = mongoose.Types.ObjectId();
    const { title } = req.body;
    const { _id: userId, projects } = req.user;
    const projectCount = projects.length;

    if (projectCount > LIMITED_PROJECT_COUNT) {
      return next(createError(423, LIMITED_PROJECT));
    }

    const newProject = {
      _id: projectId,
      secretKey: generateDbSecretKey(),
      owner: userId,
      title,
    };

    await session.withTransaction(async () => {
      await Project.create([newProject], { session });
      await User.findByIdAndUpdate(
        userId,
        { $push: { projects: projectId } },
        { session },
      );
    });

    return res.json({ id: projectId });
  } catch (error) {
    return next(error);
  } finally {
    session.endSession();
  }
};

const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(createError(400, BAD_REQUEST));
    }

    const project = await Project
      .findOne({ _id: projectId, owner: userId })
      .lean()
      .exec();

    project.secretKey = getUserSecretKey(project.secretKey);

    return res.json(project);
  } catch (error) {
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

    await Project
      .findOneAndUpdate({ projectId, owner: userId }, { title })
      .lean()
      .exec();

    return res.json({ result: SUCCESS });
  } catch (error) {
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
      await Project.deleteOne({ projectId, owner: userId }, { session });
      await User.findByIdAndUpdate(
        userId,
        { $pull: { projects: projectId } },
        { session },
      );
    });

    return res.json({ result: SUCCESS });
  } catch (error) {
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
