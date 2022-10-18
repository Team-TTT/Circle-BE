const mongoose = require("mongoose");

const SecretKey = new mongoose.Schema({
  iv: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});

const ProjectSchema = new mongoose.Schema(
  {
    secret_key: { type: SecretKey, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "Channel",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
