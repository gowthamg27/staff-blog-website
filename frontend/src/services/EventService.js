

// const API_URL = 'http://localhost:5000/api/events';

// const EventService = {
//   // Get all events
//   getAllEvents: async () => {
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       throw error;
//     }
//   },

//   // Get event by ID
//   getEventById: async (id) => {
//     try {
//       const response = await fetch(`${API_URL}/${id}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching event:', error);
//       throw error;
//     }
//   },

//   // Create new event with image upload
//   createEvent: async (eventData) => {
//     try {
//       // Create a FormData object for file uploads
//       const formData = new FormData();
      
//       console.log('Preparing event data for submission:', eventData);
      
//       // Add text fields
//       formData.append('title', eventData.title);
//       formData.append('date', eventData.date instanceof Date ? eventData.date.toISOString() : eventData.date);
//       formData.append('description', eventData.description);
//       formData.append('venue', eventData.venue);
      
//       // Add image files
//       if (eventData.newImages && eventData.newImages.length > 0) {
//         console.log('Adding images:', eventData.newImages.length, 'files');
//         eventData.newImages.forEach((file, index) => {
//           console.log(`Adding image ${index}:`, file.name);
//           formData.append('images', file);
//         });
//       }
      
//       // Log form data contents
//       console.log('FormData contents:');
//       for (let pair of formData.entries()) {
//         console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
//       }
      
//       console.log('Sending request to:', API_URL);
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         body: formData,
//         // Don't set Content-Type header with FormData, the browser sets it automatically with boundary
//       });
      
//       console.log('Response status:', response.status);
//       console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      
//       // Check if response can be parsed as JSON first
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const responseData = await response.json();
//         console.log('Response data:', responseData);
        
//         if (!response.ok) {
//           console.error('Server error:', responseData);
//           throw new Error(responseData.message || 'Failed to create event');
//         }
        
//         return responseData;
//       } else {
//         // If not JSON, handle as text
//         const textResponse = await response.text();
//         console.log('Raw response (not JSON):', textResponse);
        
//         if (!response.ok) {
//           throw new Error(`Server error: ${response.status} ${response.statusText}`);
//         }
        
//         // Try to parse as JSON anyway in case content-type is wrong
//         try {
//           return JSON.parse(textResponse);
//         } catch (e) {
//           console.warn('Could not parse response as JSON despite attempt');
//           throw new Error('Invalid response format from server - expected JSON');
//         }
//       }
//     } catch (error) {
//       console.error('Error creating event:', error);
//       throw error;
//     }
//   },

//   // Update event with fixed image handling
//   updateEvent: async (id, eventData) => {
//     try {
//       // Create a FormData object for file uploads
//       const formData = new FormData();
      
//       console.log('Preparing event update data:', eventData);
      
//       // Add text fields
//       formData.append('title', eventData.title);
//       formData.append('date', eventData.date); 
//       formData.append('description', eventData.description);
//       formData.append('venue', eventData.venue);
      
//       // Handle existing images properly
//       if (eventData.existingImages && Array.isArray(eventData.existingImages)) {
//         console.log('Adding existing images:', eventData.existingImages.length, 'items');
        
//         // Extract the image paths/URLs from complex objects if needed
//         const processedImages = eventData.existingImages.map(img => {
//           if (typeof img === 'string') {
//             // For relative paths, ensure they're in the expected format
//             if (img.startsWith('http://localhost:5000/api/')) {
//               return img.replace('http://localhost:5000', '');
//             }
//             return img;
//           } else if (typeof img === 'object' && img !== null) {
//             // Handle image objects with src property
//             if (img.src) {
//               if (img.src.startsWith('http://localhost:5000/api/')) {
//                 return img.src.replace('http://localhost:5000', '');
//               }
//               return img.src;
//             }
//           }
//           return img;
//         });
        
//         // Send as a JSON string to preserve the array structure
//         formData.append('existingImages', JSON.stringify(processedImages));
//         console.log('Processed existingImages:', processedImages);
//       } else {
//         // Always send an empty array if no existing images
//         formData.append('existingImages', JSON.stringify([]));
//       }
      
//       // Add new image files
//       if (eventData.newImages && eventData.newImages.length > 0) {
//         console.log('Adding new images:', eventData.newImages.length, 'files');
//         eventData.newImages.forEach((file, index) => {
//           console.log(`Adding image ${index}:`, file.name);
//           formData.append('images', file);
//         });
//       }
      
//       // Log form data contents
//       console.log('FormData contents for update:');
//       for (let pair of formData.entries()) {
//         console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
//       }
      
//       console.log('Sending update request to:', `${API_URL}/${id}`);
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: 'PUT',
//         body: formData,
//       });
      
//       console.log('Response status:', response.status);
      
//       // Check if response can be parsed as JSON
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const responseData = await response.json();
        
//         if (!response.ok) {
//           console.error('Server error:', responseData);
//           throw new Error(responseData.message || 'Failed to update event');
//         }
        
//         return responseData;
//       } else {
//         // Handle non-JSON response
//         const textResponse = await response.text();
        
//         if (!response.ok) {
//           throw new Error(`Server error: ${response.status} ${response.statusText}`);
//         }
        
//         try {
//           return JSON.parse(textResponse);
//         } catch (e) {
//           throw new Error('Invalid response format from server - expected JSON');
//         }
//       }
//     } catch (error) {
//       console.error('Error updating event:', error);
//       throw error;
//     }
//   },
  
//   // Delete event
//   deleteEvent: async (id) => {
//     try {
//       console.log('Sending delete request for event ID:', id);
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: 'DELETE',
//       });
      
//       console.log('Response status:', response.status);
//       console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      
//       // Check if response can be parsed as JSON first
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const responseData = await response.json();
//         console.log('Response data:', responseData);
        
//         if (!response.ok) {
//           console.error('Server error:', responseData);
//           throw new Error(responseData.message || 'Failed to delete event');
//         }
        
//         return responseData;
//       } else {
//         // If not JSON, handle as text
//         const textResponse = await response.text();
//         console.log('Raw response (not JSON):', textResponse);
        
//         if (!response.ok) {
//           throw new Error(`Server error: ${response.status} ${response.statusText}`);
//         }
        
//         // Try to parse as JSON anyway in case content-type is wrong
//         try {
//           return JSON.parse(textResponse);
//         } catch (e) {
//           console.warn('Could not parse response as JSON despite attempt');
//           throw new Error('Invalid response format from server - expected JSON');
//         }
//       }
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       throw error;
//     }
//   }
// };

// export default EventService;








import API_URL from "../config";

// Use the imported API_URL from config.js, with a fallback in case it's undefined
const EVENTS_ENDPOINT =`${API_URL}/events`; 
;

// For debugging - remove after fixing
console.log("API_URL from config:", API_URL);
console.log("EVENTS_ENDPOINT:", EVENTS_ENDPOINT);

const EventService = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await fetch(EVENTS_ENDPOINT);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await fetch(`${EVENTS_ENDPOINT}/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Create new event with image upload
  createEvent: async (eventData) => {
    try {
      // Create a FormData object for file uploads
      const formData = new FormData();
      
      console.log('Preparing event data for submission:', eventData);
      
      // Add text fields
      formData.append('title', eventData.title);
      formData.append('date', eventData.date instanceof Date ? eventData.date.toISOString() : eventData.date);
      formData.append('description', eventData.description);
      formData.append('venue', eventData.venue);
      
      // Add image files
      if (eventData.newImages && eventData.newImages.length > 0) {
        console.log('Adding images:', eventData.newImages.length, 'files');
        eventData.newImages.forEach((file, index) => {
          console.log(`Adding image ${index}:`, file.name);
          formData.append('images', file);
        });
      }
      
      // Log form data contents
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      console.log('Sending request to:', EVENTS_ENDPOINT);
      const response = await fetch(EVENTS_ENDPOINT, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header with FormData, the browser sets it automatically with boundary
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      
      // Check if response can be parsed as JSON first
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (!response.ok) {
          console.error('Server error:', responseData);
          throw new Error(responseData.message || 'Failed to create event');
        }
        
        return responseData;
      } else {
        // If not JSON, handle as text
        const textResponse = await response.text();
        console.log('Raw response (not JSON):', textResponse);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Try to parse as JSON anyway in case content-type is wrong
        try {
          return JSON.parse(textResponse);
        } catch (e) {
          console.warn('Could not parse response as JSON despite attempt');
          throw new Error('Invalid response format from server - expected JSON');
        }
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event with fixed image handling
  updateEvent: async (id, eventData) => {
    try {
      // Create a FormData object for file uploads
      const formData = new FormData();
      
      console.log('Preparing event update data:', eventData);
      
      // Add text fields
      formData.append('title', eventData.title);
      formData.append('date', eventData.date); 
      formData.append('description', eventData.description);
      formData.append('venue', eventData.venue);
      
      // Handle existing images properly
      if (eventData.existingImages && Array.isArray(eventData.existingImages)) {
        console.log('Adding existing images:', eventData.existingImages.length, 'items');
        
        // Extract the image paths/URLs from complex objects if needed
        const processedImages = eventData.existingImages.map(img => {
          if (typeof img === 'string') {
            // For relative paths, ensure they're in the expected format
            if (img.startsWith(EVENTS_ENDPOINT)) {
              // Update this to use the dynamic endpoint instead of hardcoded value
              const apiUrlBase = new URL(EVENTS_ENDPOINT).origin;
              return img.replace(apiUrlBase, '');
            }
            return img;
          } else if (typeof img === 'object' && img !== null) {
            // Handle image objects with src property
            if (img.src) {
              if (img.src.startsWith(EVENTS_ENDPOINT)) {
                // Update this to use the dynamic endpoint instead of hardcoded value
                const apiUrlBase = new URL(EVENTS_ENDPOINT).origin;
                return img.src.replace(apiUrlBase, '');
              }
              return img.src;
            }
          }
          return img;
        });
        
        // Send as a JSON string to preserve the array structure
        formData.append('existingImages', JSON.stringify(processedImages));
        console.log('Processed existingImages:', processedImages);
      } else {
        // Always send an empty array if no existing images
        formData.append('existingImages', JSON.stringify([]));
      }
      
      // Add new image files
      if (eventData.newImages && eventData.newImages.length > 0) {
        console.log('Adding new images:', eventData.newImages.length, 'files');
        eventData.newImages.forEach((file, index) => {
          console.log(`Adding image ${index}:`, file.name);
          formData.append('images', file);
        });
      }
      
      // Log form data contents
      console.log('FormData contents for update:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      console.log('Sending update request to:', `${EVENTS_ENDPOINT}/${id}`);
      const response = await fetch(`${EVENTS_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      // Check if response can be parsed as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Server error:', responseData);
          throw new Error(responseData.message || 'Failed to update event');
        }
        
        return responseData;
      } else {
        // Handle non-JSON response
        const textResponse = await response.text();
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        try {
          return JSON.parse(textResponse);
        } catch (e) {
          throw new Error('Invalid response format from server - expected JSON');
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },
  
  // Delete event
  deleteEvent: async (id) => {
    try {
      console.log('Sending delete request for event ID:', id);
      const response = await fetch(`${EVENTS_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      
      // Check if response can be parsed as JSON first
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (!response.ok) {
          console.error('Server error:', responseData);
          throw new Error(responseData.message || 'Failed to delete event');
        }
        
        return responseData;
      } else {
        // If not JSON, handle as text
        const textResponse = await response.text();
        console.log('Raw response (not JSON):', textResponse);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Try to parse as JSON anyway in case content-type is wrong
        try {
          return JSON.parse(textResponse);
        } catch (e) {
          console.warn('Could not parse response as JSON despite attempt');
          throw new Error('Invalid response format from server - expected JSON');
        }
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

export default EventService;