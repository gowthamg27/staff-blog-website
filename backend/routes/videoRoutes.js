const express = require("express");
const router = express.Router();
const Video = require("../models/Video");



// ✅ Get All Videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }); // Sort by creation date (newest first)
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Add a New Video
router.post("/", async (req, res) => {
  try {
    const { title, desc, preview, src, isYoutube, start, end } = req.body;
    const newVideo = new Video({ title, desc, preview, src, isYoutube, start, end });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ error: "Error adding video" });
  }
});

// ✅ Delete a Video
router.delete("/:id", async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting video" });
  }
});

module.exports = router;
