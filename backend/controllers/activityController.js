
const multer = require('multer');
const Activity = require("../models/Activity");

// Configure multer to store files in memory instead of disk
const storage = multer.memoryStorage();

// Filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Get all activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 }); // Sort by date, newest first
    
    // Convert binary data to base64 strings for frontend display
    const activitiesWithBase64Images = activities.map(activity => {
      const activityObj = activity.toObject();
      
      // Only process image if it exists
      if (activity.img && activity.img.data) {
        return {
          ...activityObj,
          img: {
            contentType: activity.img.contentType,
            data: activity.img.data.toString('base64')
          }
        };
      }
      
      return activityObj;
    });
    
    res.json(activitiesWithBase64Images);
  } catch (error) {
    console.error("Error in getActivities:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single activity by ID
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    
    const activityObj = activity.toObject();
    
    // Convert binary data to base64 string only if image exists
    if (activity.img && activity.img.data) {
      activityObj.img = {
        contentType: activity.img.contentType,
        data: activity.img.data.toString('base64')
      };
    }
    
    res.json(activityObj);
  } catch (error) {
    console.error("Error in getActivity:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new activity
const createActivity = async (req, res) => {
  try {
    const { title, desc, date } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    // Store image as binary data with content type
    const img = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
    
    const newActivity = new Activity({ title, desc, img, date });
    const savedActivity = await newActivity.save();
    
    // Convert binary data to base64 for response
    const activityResponse = {
      ...savedActivity.toObject(),
      img: {
        contentType: savedActivity.img.contentType,
        data: savedActivity.img.data.toString('base64')
      }
    };
    
    res.status(201).json(activityResponse);
  } catch (error) {
    console.error("Error in createActivity:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing activity
const updateActivity = async (req, res) => {
  try {
    // Find current activity to check if it exists
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    
    const updatedData = { ...req.body };
    
    // If a new image is uploaded, update the image
    if (req.file) {
      updatedData.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    } else {
      // If no new image, keep the existing image
      delete updatedData.img;
    }
    
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    
    // Convert binary data to base64 for response
    const activityResponse = {
      ...updatedActivity.toObject(),
      img: {
        contentType: updatedActivity.img.contentType,
        data: updatedActivity.img.data.toString('base64')
      }
    };
    
    res.json(activityResponse);
  } catch (error) {
    console.error("Error in updateActivity:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an activity
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error in deleteActivity:", error);
    res.status(500).json({ message: error.message });
  }
};

// Export methods
module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  upload,
};