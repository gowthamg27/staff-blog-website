

const express = require('express');
const multer = require('multer');
const path = require('path');        // Added path import
const fs = require('fs');            // Added fs import
const Image = require('../models/Gallery');  // Assuming your Image model is located here
const mongoose = require('mongoose');  // Add this line to import mongoose
const jwt = require('jsonwebtoken');  // Add JWT verification

const router = express.Router();

// Configure multer without specifying a destination as we're storing in MongoDB
const upload = multer();

// Authorization middleware for Admin role check
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify token and check user role here
  const decoded = jwt.verify(token, 'your_secret_key');
  if (decoded.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};


// Upload route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { alt, category, description } = req.body;
    const contentType = req.file.mimetype;  // Get content type (MIME type) of the uploaded file
    const imageData = req.file.buffer;      // Get the binary data of the file

    // Create new Image entry in the database with binary image data
    const newImage = new Image({
      alt,
      category,
      description: description || alt,
      contentType,
      imageData,  // Store binary data in MongoDB
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get All Images
// In your backend GET route:
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    console.log("Found images count:", images.length);
    if (images.length > 0) {
      console.log("First image sample:", {
        id: images[0]._id,
        contentType: images[0].contentType,
        hasImageData: !!images[0].imageData,
        imageDataLength: images[0].imageData ? images[0].imageData.length : 0
      });
    }
    
    const imagesWithBase64 = images.map(image => {
      // Create base object with all properties
      const imageObj = {
        _id: image._id,
        alt: image.alt,
        category: image.category,
        description: image.description,
        contentType: image.contentType,
        createdAt: image.createdAt,
        // Add a default empty string if imageData is undefined or null
        imageData: ''
      };
      
      // Only try to convert to base64 if imageData exists
      if (image.imageData) {
        imageObj.imageData = image.imageData.toString('base64');
      }
      
      return imageObj;
    });
    
    console.log("Sending response with images count:", imagesWithBase64.length);
    res.json(imagesWithBase64);
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
});



// Delete Image
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid image ID' });
    }

    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;
