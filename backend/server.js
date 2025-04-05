


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const videoRoutes = require("./routes/videoRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const researchRoutes = require("./routes/researchRoutes");
const activityRoutes = require("./routes/activityRoutes");
const eventRoutes = require("./routes/eventRoutes");
const staffRoutes = require("./routes/staffRoutes"); // Import the new staff routes



// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/staff", staffRoutes); // Add the staff API endpoint

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});