    // routes/staffRoutes.js

    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    const path = require('path');
    const staffController = require('../controllers/staffController');
    const StaffVisibility = require("../models/StaffVisibility");


    // Set up multer storage
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create directory if it doesn't exist
        const dir = path.join(__dirname, '../uploads/staff');
        require('fs').mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `staff-${Date.now()}${path.extname(file.originalname)}`);
    }
    });

    const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
        return cb(null, true);
        } else {
        cb(new Error('Only images are allowed'));
        }
    }
    });


 
// IMPORTANT: Visibility routes MUST come BEFORE /:id route
// -------------------------------------------------------

// Get Section Visibility
router.get("/visibility", async (req, res) => {
    try {
      const staffVisibility = await StaffVisibility.findOne();
      if (staffVisibility) {
        res.json(staffVisibility.sectionVisibility);
      } else {
        res.json({ 
          profile: true,
          history: true,
          achievements: true,
          journey:true
        });
      }
    } catch (error) {
      console.error("Error fetching visibility:", error);
      res.status(500).json({ error: "Error fetching visibility" });
    }
  });
  
  // Update Section Visibility
  router.put("/visibility", async (req, res) => {
    try {
      let staffVisibility = await StaffVisibility.findOne();
      if (!staffVisibility) {
        staffVisibility = new StaffVisibility({ 
          sectionVisibility: {
            profile: true,
            history: true,
            achievements: true,
            journey:true
          }
        });
      }
      staffVisibility.sectionVisibility = req.body.sectionVisibility;
      await staffVisibility.save();
      res.json({ 
        success: true, 
        sectionVisibility: staffVisibility.sectionVisibility 
      });
    } catch (error) {
      console.error("Error updating visibility:", error);
      res.status(500).json({ error: "Error updating visibility" });
    }
  });
    // Routes
    router.get('/', staffController.getAllStaff);
    router.get('/:id', staffController.getStaffById);
    // routes/staffRoutes.js

    router.post('/', upload.single('profileImage'), staffController.createStaff);

    router.put('/:id', upload.single('profileImage'), staffController.updateStaff);
    router.delete('/:id', staffController.deleteStaff);

    // router.get("/visibility", visibilityController.getVisibility);
    // router.put("/visibility", visibilityController.updateVisibility);


    module.exports = router;