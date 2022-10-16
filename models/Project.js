const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    secret_key: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
