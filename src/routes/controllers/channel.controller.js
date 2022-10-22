const mongoose = require("mongoose");
const createError = require("http-errors");

const Project = require("../../../models/Project");
const Channel = require("../../../models/Channel");

const { MESSAGE, LIMITED_CHANNEL_COUNT } = require("../../constants");

const { LIMITED_CHANNEL, BAD_REQUEST } = MESSAGE;

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

module.exports = {
  createChannel,
};
