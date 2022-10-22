const mongoose = require("mongoose");
const createError = require("http-errors");

const Project = require("../../../models/Project");
const Channel = require("../../../models/Channel");

const { MESSAGE, LIMITED_CHANNEL_COUNT } = require("../../constants");

const { LIMITED_CHANNEL, BAD_REQUEST, SUCCESS } = MESSAGE;

const createChannel = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { title, description } = req.body;
    const { projectId } = req.params;
    const channelId = mongoose.Types.ObjectId();

    if (!mongoose.isValidObjectId(projectId)) {
      return next(createError(400, BAD_REQUEST));
    }

    const selectedProject = await Project.findById(projectId)
      .lean()
      .populate("channels");

    const channelCount = selectedProject.channels.length;
    if (channelCount > LIMITED_CHANNEL_COUNT) {
      return next(createError(423, LIMITED_CHANNEL));
    }

    await session.withTransaction(async () => {
      const newChannel = { _id: channelId, title, description };

      await Channel.create([newChannel], { session });
      await Project.findByIdAndUpdate(
        projectId,
        { $push: { channels: channelId } },
        { session },
      );
    });

    return res.json({ id: channelId });
  } catch (error) {
    return next(error);
  }
};

const editChannel = async (req, res, next) => {
  try {
    const { title, description, isActive } = req.body;
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
      return next(createError(400, BAD_REQUEST));
    }

    await Channel
      .findByIdAndUpdate(
        channelId,
        { title, description, isActive },
      );

    return res.json({ result: SUCCESS });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createChannel,
  editChannel,
};
