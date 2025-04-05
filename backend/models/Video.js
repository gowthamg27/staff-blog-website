const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  desc: String,
  preview: String,
  src: String,
  isYoutube: Boolean,
  start: Number, // Start time in seconds
  end: Number    // End time in seconds
});

module.exports = mongoose.model("Video", videoSchema);
