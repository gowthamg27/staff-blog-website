









const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String, // ✅ FIXED: Changed `desc` to `description`
});

const historyItemSchema = new mongoose.Schema({
  title: String,
  description: String, // ✅ FIXED: Changed `desc` to `description`
});

const timelineItemSchema = new mongoose.Schema({
  year: String,
  title: String,
  description: String,
});

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    sectionVisibility: {
      profile: { type: Boolean, default: true },
      history: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      journey:{ type: Boolean, default: true },
    },
    qualifications: { type: String, required: true, trim: true },
    profileImage: { type: String, default: "" },
    about: { type: String, required: true },
    achievements: [achievementSchema],
    history: [historyItemSchema],
    timeline: [timelineItemSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
