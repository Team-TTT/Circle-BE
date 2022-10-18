const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  profile_url: { type: String },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Project",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
