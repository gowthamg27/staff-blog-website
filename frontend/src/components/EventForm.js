

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { X, Upload, X as XIcon } from "lucide-react";

// // Array of month names
// const months = [
//   "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
// ];

// const EventForm = ({ event, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     day: "",
//     month: "",
//     year: "",
//     description: "",
//     venue: "",
//     newImages: [],
//     existingImages: []
//   });
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
//   const [errors, setErrors] = useState({});

//   // Helper function to get proper image URL
//   const getImageUrl = (image, idx, eventId) => {
//     if (!image) return '';
    
//     if (typeof image === 'string') {
//       if (image.startsWith('/api/')) {
//         return `http://localhost:5000${image}`;
//       }
//       return image;
//     } else if (image.src) {
//       return getImageUrl(image.src, idx, eventId);
//     } else if (eventId) {
//       return `http://localhost:5000/api/events/image/${eventId}/${idx}`;
//     }
    
//     return '';
//   };

//   // Initialize form with event data if editing
//   useEffect(() => {
//     if (event) {
//       console.log("Initializing form with event:", event);
      
//       // Parse the full date string properly
//       const dateParts = event.date ? event.date.split(' ') : ["", "", ""];
//       let day = "", month = "", year = "";
      
//       // Handle different date formats (with or without day)
//       if (dateParts.length === 3) {
//         // Format: "15 January 2025"
//         [day, month, year] = dateParts;
//       } else if (dateParts.length === 2) {
//         // Format: "January 2025"
//         [month, year] = dateParts;
//       }
      
//       // Process existing images more carefully
//       let existingImages = [];
//       if (event.images && Array.isArray(event.images)) {
//         existingImages = event.images.map((img, index) => {
//           // If it's a full URL, preserve it
//           if (typeof img === 'string') {
//             return img;
//           } 
//           // If it's an object with src, use that
//           else if (typeof img === 'object' && img !== null && img.src) {
//             return img.src;
//           }
//           // Otherwise generate the expected URL format
//           else if (event._id) {
//             return `http://localhost:5000/api/events/image/${event._id}/${index}`;       //change the
//           }
//           return img;
//         });
//       }
      
//       setFormData({
//         title: event.title || "",
//         day: day || "",
//         month: month || "",
//         year: year || "",
//         description: event.description || "",
//         venue: event.venue || "",
//         existingImages: existingImages,
//         newImages: []
//       });
//     }
//   }, [event]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleImageChange = (e) => {
//     e.preventDefault();
    
//     const files = Array.from(e.target.files);
    
//     // Preview images
//     const newImageUrls = files.map(file => URL.createObjectURL(file));
//     setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls]);
    
//     // Store files for upload
//     setImageFiles([...imageFiles, ...files]);
//     setFormData({
//       ...formData,
//       newImages: [...formData.newImages, ...files]
//     });
//   };

//   const removeImage = (index) => {
//     // Remove from preview
//     const newPreviewUrls = [...imagePreviewUrls];
//     newPreviewUrls.splice(index, 1);
//     setImagePreviewUrls(newPreviewUrls);
    
//     // Remove from files array
//     const newFiles = [...imageFiles];
//     newFiles.splice(index, 1);
//     setImageFiles(newFiles);
    
//     // Remove from form data
//     const newFormImages = [...formData.newImages];
//     newFormImages.splice(index, 1);
//     setFormData({
//       ...formData,
//       newImages: newFormImages
//     });
//   };

//   const removeExistingImage = (index) => {
//     const newExistingImages = [...formData.existingImages];
//     newExistingImages.splice(index, 1);
//     setFormData({
//       ...formData,
//       existingImages: newExistingImages
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.month || !formData.year) newErrors.date = "Month and year are required";
//     if (!formData.description.trim()) newErrors.description = "Description is required";
//     if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     // Format the date properly with or without day
//     let dateString;
//     if (formData.day) {
//       dateString = `${formData.day} ${formData.month} ${formData.year}`;
//     } else {
//       dateString = `${formData.month} ${formData.year}`;
//     }
    
//     // Prepare data for submission
//     const eventData = {
//       title: formData.title,
//       date: dateString,
//       description: formData.description,
//       venue: formData.venue,
//       existingImages: formData.existingImages, // Important! Keep the existing images
//       newImages: imageFiles // Use the actual file objects for new uploads
//     };
    
//     console.log("Submitting event data:", eventData);
//     onSubmit(eventData);
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">
//               {event ? "Edit Event" : "Create New Event"}
//             </h2>
//             <button
//               onClick={onCancel}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-gray-700 mb-2">Event Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className={`w-full p-3 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"}`}
//                   placeholder="Enter event title"
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//                 )}
//               </div>

//               {/* Day, Month, and Year Inputs */}
//               <div>
//                 <label className="block text-gray-700 mb-2">Event Date</label>
//                 <div className="flex gap-4">
//                   <input
//                     type="number"
//                     name="day"
//                     value={formData.day}
//                     onChange={handleChange}
//                     className={`w-1/4 p-3 border rounded-lg ${errors.date ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="Day (optional)"
//                     min="1"
//                     max="31"
//                   />
//                   <select
//                     name="month"
//                     value={formData.month}
//                     onChange={handleChange}
//                     className={`w-1/2 p-3 border rounded-lg ${errors.date ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select Month</option>
//                     {months.map((month, index) => (
//                       <option key={index} value={month}>
//                         {month}
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     type="number"
//                     name="year"
//                     value={formData.year}
//                     onChange={handleChange}
//                     className={`w-1/4 p-3 border rounded-lg ${errors.date ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="Year"
//                     min="2000"
//                     max="2100"
//                   />
//                 </div>
//                 {errors.date && (
//                   <p className="text-red-500 text-sm mt-1">{errors.date}</p>
//                 )}
//               </div>
//             </div>

//             {/* Venue and Description Fields */}
//             <div className="mb-6">
//               <label className="block text-gray-700 mb-2">Venue</label>
//               <input
//                 type="text"
//                 name="venue"
//                 value={formData.venue}
//                 onChange={handleChange}
//                 className={`w-full p-3 border rounded-lg ${errors.venue ? "border-red-500" : "border-gray-300"}`}
//                 placeholder="Enter venue"
//               />
//               {errors.venue && (
//                 <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
//               )}
//             </div>

//             <div className="mb-6">
//               <label className="block text-gray-700 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="4"
//                 className={`w-full p-3 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
//                 placeholder="Enter event description"
//               ></textarea>
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//               )}
//             </div>

//             {/* Existing Images Section */}
//             {formData.existingImages && formData.existingImages.length > 0 && (
//               <div className="mb-6">
//                 <label className="block text-gray-700 mb-2">Current Images</label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {formData.existingImages.map((image, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={typeof image === 'string' ? image : getImageUrl(image, index, event?._id)}
//                         alt={`Image ${index + 1}`}
//                         className="w-full h-24 object-cover rounded-lg border border-gray-300"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeExistingImage(index)}
//                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <XIcon size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* New Images Upload */}
//             <div className="mb-8">
//               <label className="block text-gray-700 mb-2">Upload Images</label>
//               <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
//                 onClick={() => document.getElementById("image-upload").click()}
//               >
//                 <Upload className="mx-auto text-gray-400 mb-2" size={24} />
//                 <p className="text-gray-500">
//                   Click to upload or drag and drop images here
//                 </p>
//                 <input
//                   id="image-upload"
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </div>
              
//               {/* Image Previews */}
//               {imagePreviewUrls.length > 0 && (
//                 <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {imagePreviewUrls.map((url, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={url}
//                         alt={`Preview ${index}`}
//                         className="w-full h-24 object-cover rounded-lg border border-gray-300"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <XIcon size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 {event ? "Update Event" : "Create Event"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default EventForm;








import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Upload, X as XIcon } from "lucide-react";
import API_URL from '../config';

// Array of month names
const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    day: "",
    month: "",
    year: "",
    description: "",
    venue: "",
    newImages: [],
    existingImages: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  // Helper function to get proper image URL
  const getImageUrl = (image, idx, eventId) => {
    if (!image) return '';
    
    if (typeof image === 'string') {
      if (image.startsWith('/api/')) {
        return `${API_URL}${image}`;
      }
      return image;
    } else if (image.src) {
      return getImageUrl(image.src, idx, eventId);
    } else if (eventId) {
      return `${API_URL}/api/events/image/${eventId}/${idx}`;
    }
    
    return '';
  };

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      console.log("Initializing form with event:", event);
      
      // Parse the full date string properly
      const dateParts = event.date ? event.date.split(' ') : ["", "", ""];
      let day = "", month = "", year = "";
      
      // Handle different date formats (with or without day)
      if (dateParts.length === 3) {
        // Format: "15 January 2025"
        [day, month, year] = dateParts;
      } else if (dateParts.length === 2) {
        // Format: "January 2025"
        [month, year] = dateParts;
      }
      
      // Process existing images more carefully
      let existingImages = [];
      if (event.images && Array.isArray(event.images)) {
        existingImages = event.images.map((img, index) => {
          // If it's a full URL, preserve it
          if (typeof img === 'string') {
            return img;
          } 
          // If it's an object with src, use that
          else if (typeof img === 'object' && img !== null && img.src) {
            return img.src;
          }
          // Otherwise generate the expected URL format
          else if (event._id) {
            return `${API_URL}/api/events/image/${event._id}/${index}`;
          }
          return img;
        });
      }
      
      setFormData({
        title: event.title || "",
        day: day || "",
        month: month || "",
        year: year || "",
        description: event.description || "",
        venue: event.venue || "",
        existingImages: existingImages,
        newImages: []
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.target.files);
    
    // Preview images
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls]);
    
    // Store files for upload
    setImageFiles([...imageFiles, ...files]);
    setFormData({
      ...formData,
      newImages: [...formData.newImages, ...files]
    });
  };

  const removeImage = (index) => {
    // Remove from preview
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
    
    // Remove from files array
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    
    // Remove from form data
    const newFormImages = [...formData.newImages];
    newFormImages.splice(index, 1);
    setFormData({
      ...formData,
      newImages: newFormImages
    });
  };

  const removeExistingImage = (index) => {
    const newExistingImages = [...formData.existingImages];
    newExistingImages.splice(index, 1);
    setFormData({
      ...formData,
      existingImages: newExistingImages
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.month || !formData.year) newErrors.date = "Month and year are required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Format the date properly with or without day
    let dateString;
    if (formData.day) {
      dateString = `${formData.day} ${formData.month} ${formData.year}`;
    } else {
      dateString = `${formData.month} ${formData.year}`;
    }
    
    // Prepare data for submission
    const eventData = {
      title: formData.title,
      date: dateString,
      description: formData.description,
      venue: formData.venue,
      existingImages: formData.existingImages, // Important! Keep the existing images
      newImages: imageFiles // Use the actual file objects for new uploads
    };
    
    console.log("Submitting event data:", eventData);
    onSubmit(eventData);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Day, Month, and Year Inputs */}
              <div>
                <label className="block text-gray-700 mb-2">Event Date</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className={`w-1/4 p-3 border rounded-lg ${errors.date ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Day (optional)"
                    min="1"
                    max="31"
                  />
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className={`w-1/2 p-3 border rounded-lg ${errors.date ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Month</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-1/4 p-3 border rounded-lg ${errors.date ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Year"
                    min="2000"
                    max="2100"
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            </div>

            {/* Venue and Description Fields */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${errors.venue ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter venue"
              />
              {errors.venue && (
                <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full p-3 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter event description"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Existing Images Section */}
            {formData.existingImages && formData.existingImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Current Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof image === 'string' ? image : getImageUrl(image, index, event?._id)}
                        alt={`Event item ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div className="mb-8">
              <label className="block text-gray-700 mb-2">Upload Images</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById("image-upload").click()}
              >
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-gray-500">
                  Click to upload or drag and drop images here
                </p>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {event ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventForm;