
const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

// Get a single event by ID - This function was missing
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

// Get image by event ID and image index
exports.getEventImage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const imageIndex = parseInt(req.params.index);
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= event.images.length) {
      return res.status(404).json({ message: "Image not found" });
    }

    const image = event.images[imageIndex];
    
    // Set the content type from the stored image
    res.set('Content-Type', image.contentType);
    
    // Send the image data as the response
    return res.send(image.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error: error.message });
  }
};

// Create a new event with image uploads
exports.createEvent = async (req, res) => {
  try {
    const { title, date, description, venue } = req.body;
    
    // Process uploaded files to create image array
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          data: file.buffer,  // Store the image data directly in MongoDB
          contentType: file.mimetype,
          fileName: file.originalname,
          alt: `${title} image ${index + 1}`
        });
      });
    }

    const event = new Event({
      title,
      date,
      description,
      venue,
      images
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: "Error creating event", error: error.message });
  }
};



exports.updateEvent = async (req, res) => {
  try {
    const { title, date, description, venue, existingImages } = req.body;
    const eventId = req.params.id;
    
    // Find the event to be updated
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Start with empty array for current images
    let currentImages = [];
    
    // Process existingImages parameter
    if (existingImages) {
      try {
        // Parse the existingImages JSON if it's a string
        const existingImagesArray = typeof existingImages === 'string' 
          ? JSON.parse(existingImages) 
          : existingImages;
        
        console.log("Processing existingImages:", existingImagesArray);
        
        // If we have a valid array
        if (Array.isArray(existingImagesArray) && existingImagesArray.length > 0) {
          // Check if we're dealing with URL patterns like '/api/events/image/:id/:index'
          if (existingImagesArray.every(item => typeof item === 'string' && item.includes('/api/events/image/'))) {
            console.log("Processing image URLs");
            
            // Keep track of which indices to include from the original event images
            const indicesToKeep = [];
            
            existingImagesArray.forEach(url => {
              // Extract the index from the URL
              const urlParts = url.split('/');
              if (urlParts.length > 0) {
                const index = parseInt(urlParts[urlParts.length - 1]);
                if (!isNaN(index) && index >= 0 && index < event.images.length) {
                  indicesToKeep.push(index);
                }
              }
            });
            
            // Add the images at those indices to the current images array
            indicesToKeep.forEach(index => {
              currentImages.push(event.images[index]);
            });
          }
          // If we're dealing with regular IDs
          else if (existingImagesArray.every(item => typeof item === 'string' || (typeof item === 'object' && item._id))) {
            console.log("Processing image IDs to keep");
            // Get the IDs to compare with
            const idsToKeep = existingImagesArray.map(item => 
              typeof item === 'string' ? item : item._id.toString()
            );
            
            // Filter the existing images based on the IDs
            currentImages = event.images.filter(img => 
              idsToKeep.includes(img._id.toString())
            );
          }
          // If we're dealing with indices
          else if (existingImagesArray.every(item => typeof item === 'number')) {
            console.log("Processing image indices to keep");
            existingImagesArray.forEach(index => {
              if (index >= 0 && index < event.images.length) {
                currentImages.push(event.images[index]);
              }
            });
          }
        } else if (Array.isArray(existingImagesArray) && existingImagesArray.length === 0) {
          // If an empty array is explicitly provided, it means no existing images should be kept
          console.log("Empty array provided, removing all existing images");
          currentImages = [];
        }
      } catch (err) {
        console.error("Error processing existing images:", err);
        // Default behavior: keep all existing images if there's an error
        currentImages = [...event.images];
        console.log("Keeping all existing images due to error processing existingImages");
      }
    } else {
      // Default behavior: if no existingImages parameter provided, keep all existing images
      currentImages = [...event.images];
      console.log("Keeping all existing images because no existingImages parameter was provided");
    }

    // Process any newly uploaded images
    if (req.files && req.files.length > 0) {
      console.log(`Adding ${req.files.length} new images`);
      req.files.forEach((file) => {
        currentImages.push({
          data: file.buffer,
          contentType: file.mimetype,
          fileName: file.originalname,
          alt: `${title || event.title} image`
        });
      });
    }

    console.log(`Total images after processing: ${currentImages.length}`);

    // Update the event with new data
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title: title || event.title,
        date: date || event.date,
        description: description || event.description,
        venue: venue || event.venue,
        images: currentImages
      },
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: "Error updating event", error: error.message });
  }
};
// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete the event from the database
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};