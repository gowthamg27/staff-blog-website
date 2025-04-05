

const express = require("express");
const router = express.Router();
const {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  upload,
} = require("../controllers/activityController");

// GET all activities
router.get("/", getActivities);

// GET a single activity
router.get("/:id", getActivity);

// POST create a new activity with image upload
router.post("/", upload.single('img'), createActivity);  // 'img' is the name of the file input

// PUT update an activity with image upload
router.put("/:id", upload.single('img'), updateActivity);

// DELETE an activity
router.delete("/:id", deleteActivity);

module.exports = router;
