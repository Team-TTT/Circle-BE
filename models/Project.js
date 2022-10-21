const mongoose = require("mongoose");

const SecretKeySchema = new mongoose.Schema({
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
    secret_key: { type: SecretKeySchema, required: true },
    owner: {
      type: String,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", ProjectSchema);
