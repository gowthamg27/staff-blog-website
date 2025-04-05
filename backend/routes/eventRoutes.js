

const express = require("express");
const router = express.Router();
const multer = require("multer");
const eventController = require("../controllers/eventController");

// Configure multer to store files in memory instead of disk
const storage = multer.memoryStorage();

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET all events
router.get("/", eventController.getAllEvents);

// GET a single event by ID
router.get("/:id", eventController.getEventById);

// GET image by event ID and image index
router.get("/image/:id/:index", eventController.getEventImage);

// POST a new event with multiple image uploads
router.post("/", upload.array("images", 8), eventController.createEvent);

// PUT update an event by ID
router.put("/:id", upload.array("images", 8), eventController.updateEvent);

// DELETE an event by ID
router.delete("/:id", eventController.deleteEvent);

module.exports = router;