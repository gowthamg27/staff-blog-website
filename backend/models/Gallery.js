


const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  imageData: { type: Buffer, required: true },  // Store image as binary data
  contentType: { type: String, required: true }, // MIME type of the file
  alt: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { 
  // Add this to make sure virtual properties are included 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add a virtual to check if the image data is valid
GallerySchema.virtual('hasValidImageData').get(function() {
  return !!this.imageData && this.imageData.length > 0;
});

module.exports = mongoose.model('Gallery', GallerySchema);