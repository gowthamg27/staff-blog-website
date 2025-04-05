

const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Research = require('../models/ResearchModel');
const getGridFSBucket = require('../config/gridfs');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// POST route to add a new research paper
router.post('/', upload.single('file'), async (req, res) => {
  const { title, author, year } = req.body;
  const fileBuffer = req.file.buffer;

  try {
    const bucket = await getGridFSBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: req.file.mimetype });
    uploadStream.end(fileBuffer);

    const newResearch = new Research({
      title,
      author,
      year,
      file: uploadStream.id, // Store the GridFS file ID
    });

    await newResearch.save();
    res.json(newResearch); // Return the saved research paper with metadata
  } catch (error) {
    console.error('Error uploading research paper:', error);
    res.status(500).send('Server Error');
  }
});

// GET route to fetch all research papers
router.get('/', async (req, res) => {
  try {
    const researchPapers = await Research.find(); // Fetch all research papers
    res.json(researchPapers); // Return the list of research papers
  } catch (error) {
    console.error('Error fetching research papers:', error);
    res.status(500).send('Server Error');
  }
});

// GET route to download a file from GridFS
router.get('/download/:fileId', async (req, res) => {
    const { fileId } = req.params;  // Just use the fileId directly
  
    try {
      const bucket = await getGridFSBucket();
      const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();  // Using new ObjectId() for clarity
  
      if (!file.length) {
        return res.status(404).send('File not found');
      }
  
      const downloadStream = bucket.openDownloadStream(file[0]._id);  // Use the correct _id here
  
      res.setHeader('Content-Type', file[0].contentType);
      res.setHeader('Content-Disposition', `attachment; filename=${file[0].filename}`);
      downloadStream.pipe(res);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Server Error');
    }
  });

// DELETE route to remove a research paper and its file from GridFS
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the research paper to get the fileId
      const research = await Research.findById(id);
      if (!research) {
        return res.status(404).json({ message: 'Research paper not found' });
      }
  
      const fileId = research.file;
  
      // First, delete the research paper from the database
      await Research.findByIdAndDelete(id);
  
      // Now delete the file from GridFS
      const bucket = await getGridFSBucket();
      await bucket.delete(fileId);
  
      res.status(200).json({ message: 'Research paper and file deleted' });
    } catch (error) {
      console.error('Error deleting research paper:', error);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;
