


// models/StaffVisibility.js
const mongoose = require("mongoose");

const StaffVisibilitySchema = new mongoose.Schema({
  // Remove unnecessary name and title fields
  sectionVisibility: {
    profile: { type: Boolean, default: true },
    history: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    journey:{ type: Boolean, default: true },
  },
});

const StaffVisibility = mongoose.model("StaffVisibility", StaffVisibilitySchema);
module.exports = StaffVisibility;