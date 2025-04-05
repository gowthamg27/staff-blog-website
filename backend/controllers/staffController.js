

const Staff = require('../models/staffModel');
const fs = require('fs');
const path = require('path');

// Get all staff profiles
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Failed to fetch staff profiles' });
  }
};

// Get a single staff profile by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    res.status(500).json({ message: 'Failed to fetch staff profile' });
  }
};


// Create a new staff profile
exports.createStaff = async (req, res) => {
  try {
    const { name, title, qualifications, about } = req.body;
    
    // Parse JSON strings for array fields
    const achievements = JSON.parse(req.body.achievements || '[]').map(item => ({
        icon: item.icon || "",
        title: item.title || "",
        description: item.description || ""  // Ensure description is present
      }));
      
    const history = JSON.parse(req.body.history || '[]').map(item => ({
        title: item.title || "",
        description: item.description || ""  // Ensure description is present
      }));
      
    const timeline = JSON.parse(req.body.timeline || '[]').map(item => ({
        year: item.year || "",
        title: item.title || "",
        description: item.description || ""  // Ensure description is present
      }));
    
    // Create new staff object with MongoDB model
    const newStaff = new Staff({
      name,
      title,
      qualifications,
      about,
      achievements,
      history,
      timeline,
      profileImage: req.file ? `/uploads/staff/${req.file.filename}` : ''
    });

    // Save the new staff profile to MongoDB
    const savedStaff = await newStaff.save();
    
    res.status(201).json({
      message: 'Staff profile created successfully',
      staff: savedStaff
    });
  } catch (error) {
    console.error('Error creating staff profile:', error);
    res.status(500).json({ message: 'Failed to create staff profile', error: error.message });
  }
};



// Update a staff profile
exports.updateStaff = async (req, res) => {
  try {
    const { name, title, qualifications, about } = req.body;
    
    // Parse JSON strings for array fields
    const achievements = JSON.parse(req.body.achievements || '[]').map(item => ({
        icon: item.icon || "",
        title: item.title || "",
        description: item.description || ""  // Ensure description is present
      }));
      
    const history = JSON.parse(req.body.history || '[]').map(item => ({
        title: item.title || "",
        description: item.description || ""  // Ensure description is present
      }));

    // Fix: Properly parse and structure timeline data
    const timeline = JSON.parse(req.body.timeline || '[]').map(item => ({
        year: item.year || "",
        title: item.title || "",
        description: item.description || ""  // Ensure description is present
      }));
    
    // Find the existing staff profile
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    
    // Prepare update object
    const updateData = {
      name,
      title,
      qualifications,
      about,
      achievements,
      history,
      timeline
    };
    
    // Handle image update
    if (req.file) {
      // Remove old image if exists
      if (staff.profileImage) {
        const oldImagePath = path.join(__dirname, '..', staff.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image path
      updateData.profileImage = `/uploads/staff/${req.file.filename}`;
    }
    
    // Update the staff profile in MongoDB
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return the updated document
    );

    console.log("Updated Staff Data:", JSON.stringify(updatedStaff, null, 2)); 
    
    res.json({
      message: 'Staff profile updated successfully',
      staff: updatedStaff
    });
  } catch (error) {
    console.error('Error updating staff profile:', error);
    res.status(500).json({ message: 'Failed to update staff profile', error: error.message });
  }
};

// Delete a staff profile
exports.deleteStaff = async (req, res) => {
  try {
    // Find the staff profile
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }

    // Remove profile image if exists
    if (staff.profileImage) {
      const imagePath = path.join(__dirname, '..', staff.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove from MongoDB
    await Staff.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Staff profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting staff profile:', error);
    res.status(500).json({ message: 'Failed to delete staff profile', error: error.message });
  }
};



// Update a staff member's visibility settings
exports.updateStaffVisibility = async (req, res) => {
  try {
    const { sectionVisibility } = req.body;
    
    // Find the staff profile
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    
    // Update visibility settings
    staff.sectionVisibility = sectionVisibility;
    await staff.save();
    
    res.json({
      message: 'Staff visibility settings updated successfully',
      sectionVisibility: staff.sectionVisibility
    });
  } catch (error) {
    console.error('Error updating staff visibility:', error);
    res.status(500).json({ message: 'Failed to update staff visibility', error: error.message });
  }
};  