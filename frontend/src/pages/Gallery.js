

// import { motion } from "framer-motion";
// import { useState, useEffect, useCallback, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext"; // Import the AuthContext

// const Gallery = () => {
//   const { user } = useContext(AuthContext); // Get user context for role check
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imageName, setImageName] = useState("");
//   const [category, setCategory] = useState("");
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch images from backend
//   // In your fetchImages function, add more detailed logging:
// const fetchImages = useCallback(async () => {
//   try {
//     setLoading(true);
//     setErrorMessage(""); // Reset error before fetching
//     const response = await axios.get("http://localhost:5000/api/gallery");                  //change the url loaclhost only
//     console.log("API Response:", response);
//     console.log("First image data:", response.data[0]); 
    
//     if (Array.isArray(response.data)) {
//       setGalleryImages(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
//     } else {
//       console.error("Unexpected response format:", response.data);
//       setErrorMessage("Received unexpected data format from server");
//     }
//   } catch (error) {
//     console.error("Failed to fetch images", error);
//     setErrorMessage("Failed to fetch images: " + (error.response?.data?.message || error.message));
//   } finally {
//     setLoading(false);
//   }
// }, []);


//   useEffect(() => {
//     fetchImages();
//   }, [fetchImages]);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImageName(file.name);
//     }
//   };

//   // Upload images to backend
//   const handleImageUpload = async () => {
//     if (!imageFile || !imageName || !category) {
//       setErrorMessage("Please provide an image, name, and category.");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", imageFile);
//     formData.append("alt", imageName);
//     formData.append("category", category);
//     formData.append("description", imageName);

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5000/api/gallery", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${token}`,
//         }
//       });

//       fetchImages(); // 🔄 Fetch images again to update the gallery
//       setImageFile(null);
//       setImageName("");
//       setCategory("");
//       setErrorMessage("Image uploaded successfully!");
//     } catch (error) {
//       console.error("Upload failed", error);
//       setErrorMessage("Image upload failed. Please try again.");
//     } finally {
//       setTimeout(() => setErrorMessage(""), 3000);
//     }
//   };

//   const handleDeleteImage = async (imageId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!imageId) {
//         setErrorMessage("Image ID is missing!");
//         return;
//       }
//       await axios.delete(`http://localhost:5000/api/gallery/${imageId}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       setGalleryImages((prevImages) => prevImages.filter(img => img._id !== imageId)); // Use _id instead of id
//       setErrorMessage("Image deleted successfully!");
//     } catch (error) {
//       console.error("Delete failed", error);
//       setErrorMessage("Failed to delete image.");
//     } finally {
//       setTimeout(() => setErrorMessage(""), 3000);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 min-h-screen bg-gray-100">
//       <motion.h1
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="text-4xl font-bold text-center my-5 text-gray-800"
//       >
//         Photo Gallery
//       </motion.h1>

//       <motion.p
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//         className="text-center text-gray-600 mb-10 text-lg"
//       >
//         A visual journey through academic milestones, research, and professional achievements.
//       </motion.p>

//       {/* Upload Section */}
//       {user && user.role === "admin" && (
//         <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
//           <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="p-2 border rounded-lg bg-white w-full"
//             />
//             <input
//               type="text"
//               placeholder="Category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="p-2 border rounded-lg w-full md:w-32"
//             />
//             <button
//               onClick={handleImageUpload}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
//             >
//               Upload
//             </button>
//           </div>
//         </div>
//       )}

//       {errorMessage && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg z-50"
//         >
//           {errorMessage}
//         </motion.div>
//       )}

//       {loading ? (
//         <p className="text-center text-lg text-gray-600">Loading images...</p>
//       ) : (
//         <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
//           {/* Gallery Images */}
//           {galleryImages.length > 0 ? (
//             galleryImages.map((image, index) => (
//               <motion.div
//                 key={image._id || index} // Use _id for consistency
//                 className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white"
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 initial={{ opacity: 0, scale: 0.85 }}
//                 transition={{ delay: (index % 10) * 0.05, duration: 0.4, ease: "easeOut" }}
//                 viewport={{ once: false, amount: 0.5 }}
//                 onClick={() => setSelectedImage(image)}  // Using image here
//               >
// <img 
//   src={`data:${image.contentType || 'image/jpeg'};base64,${image.imageData}`} 
//   alt={image.alt || 'Gallery image'} 
//   className="w-full h-48 object-cover rounded-lg" 
//   loading="lazy" 
//   onError={(e) => {
//     console.error("Image load error:", image);
//     e.target.src = 'https://via.placeholder.com/300?text=Error+Loading+Image';
//   }}
// />
//                 {user && user.role === "admin" && (
//                   <button
//                     onClick={(e) => { 
//                       e.stopPropagation(); 
//                       handleDeleteImage(image._id); // Using image here
//                     }}
//                     className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
//                   >
//                     Delete
//                   </button>
//                 )}
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-lg text-gray-600 col-span-full">No images available.</p>
//           )}
//         </motion.div>
//       )}

//       {/* Full-Screen Image Modal */}
//       {selectedImage && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={() => setSelectedImage(null)}  // Close on click outside
//         >
//           <div className="relative">
//             {/* Close Button */}
//             <button 
//               className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-200 transition"
//               onClick={() => setSelectedImage(null)}
//             >
//               ✕
//             </button>

//             {/* Full-Screen Image */}
//             <motion.img  
//               src={`data:${selectedImage.contentType};base64,${selectedImage.imageData}`}  // Use selectedImage in the modal
//               alt={selectedImage.alt}  
//               className="w-[calc(90vw-25px)] h-[calc(90vh-25px)] object-cover rounded-lg"  
//               initial={{ scale: 0.8 }}  
//               animate={{ scale: 1 }}  
//               exit={{ scale: 0.8 }}  
//             />
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Gallery;




import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import the AuthContext
import API_URL from "../config"; // Import API_URL from config

const Gallery = () => {
  const { user } = useContext(AuthContext); // Get user context for role check
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [category, setCategory] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch images from backend with imported API_URL
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(""); // Reset error before fetching
      const response = await axios.get(`${API_URL}/gallery`);
      console.log("API Response:", response);
      console.log("First image data:", response.data[0]); 
      
      if (Array.isArray(response.data)) {
        setGalleryImages(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        console.error("Unexpected response format:", response.data);
        setErrorMessage("Received unexpected data format from server");
      }
    } catch (error) {
      console.error("Failed to fetch images", error);
      setErrorMessage("Failed to fetch images: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImageName(file.name);
    }
  };

  // Upload images to backend with imported API_URL
  const handleImageUpload = async () => {
    if (!imageFile || !imageName || !category) {
      setErrorMessage("Please provide an image, name, and category.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("alt", imageName);
    formData.append("category", category);
    formData.append("description", imageName);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/gallery`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        }
      });

      fetchImages(); // 🔄 Fetch images again to update the gallery
      setImageFile(null);
      setImageName("");
      setCategory("");
      setErrorMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      setErrorMessage("Image upload failed. Please try again.");
    } finally {
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");
      if (!imageId) {
        setErrorMessage("Image ID is missing!");
        return;
      }
      await axios.delete(`${API_URL}/gallery/${imageId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setGalleryImages((prevImages) => prevImages.filter(img => img._id !== imageId));
      setErrorMessage("Image deleted successfully!");
    } catch (error) {
      console.error("Delete failed", error);
      setErrorMessage("Failed to delete image.");
    } finally {
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold text-center my-5 text-gray-800"
      >
        Photo Gallery
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center text-gray-600 mb-10 text-lg"
      >
        A visual journey through academic milestones, research, and professional achievements.
      </motion.p>

      {/* Upload Section */}
      {user && user.role === "admin" && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border rounded-lg bg-white w-full"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded-lg w-full md:w-32"
            />
            <button
              onClick={handleImageUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg z-50"
        >
          {errorMessage}
        </motion.div>
      )}

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading images...</p>
      ) : (
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {/* Gallery Images */}
          {galleryImages.length > 0 ? (
            galleryImages.map((image, index) => (
              <motion.div
                key={image._id || index} // Use _id for consistency
                className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white"
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: (index % 10) * 0.05, duration: 0.4, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.5 }}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={`data:${image.contentType || 'image/jpeg'};base64,${image.imageData}`} 
                  alt={image.alt || 'Gallery image'} 
                  className="w-full h-48 object-cover rounded-lg" 
                  loading="lazy" 
                  onError={(e) => {
                    console.error("Image load error:", image);
                    e.target.src = 'https://via.placeholder.com/300?text=Error+Loading+Image';
                  }}
                />
                {user && user.role === "admin" && (
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleDeleteImage(image._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-600 col-span-full">No images available.</p>
          )}
        </motion.div>
      )}

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-200 transition"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            {/* Full-Screen Image */}
            <motion.img  
              src={`data:${selectedImage.contentType};base64,${selectedImage.imageData}`}
              alt={selectedImage.alt}  
              className="w-[calc(90vw-25px)] h-[calc(90vh-25px)] object-cover rounded-lg"  
              initial={{ scale: 0.8 }}  
              animate={{ scale: 1 }}  
              exit={{ scale: 0.8 }}  
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;