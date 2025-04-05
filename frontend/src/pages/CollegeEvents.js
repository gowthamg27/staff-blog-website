

// import React, { useState, useEffect, useContext } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
// import EventService from "../services/EventService";
// import EventForm from "../components/EventForm"; 
// import { AuthContext } from "../context/AuthContext";

// const Events = () => {
//   const { user } = useContext(AuthContext);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Add this effect to prevent body scrolling when modal is open
//   useEffect(() => {
//     if (selectedEvent) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
    
//     // Cleanup function
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [selectedEvent]);

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const data = await EventService.getAllEvents();
//       setEvents(data);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load events. Please try again later.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateEvent = async (eventData) => {
//     try {
//       await EventService.createEvent(eventData);
//       setShowForm(false);
//       fetchEvents();
//     } catch (err) {
//       console.error("Failed to create event:", err);
//       alert("Failed to create event. Please try again.");
//     }
//   };

//   const handleUpdateEvent = async (id, eventData) => {
//     try {
//       // Create a clean copy of the event data
//       const eventDataCopy = { ...eventData };
      
//       // Ensure we have the correct fields structure for the API
//       console.log("Original update data:", eventDataCopy);
      
//       // Process existing images - ensure we're using them correctly
//       if (eventDataCopy.existingImages && Array.isArray(eventDataCopy.existingImages)) {
//         // Already properly structured from EventForm
//         console.log("Using existing images from form:", eventDataCopy.existingImages);
//       } else if (eventDataCopy.images && Array.isArray(eventDataCopy.images)) {
//         // Extract existing images (those that are strings or have URLs)
//         const existingImages = eventDataCopy.images.filter(img => 
//           typeof img === 'string' || 
//           (typeof img === 'object' && !(img instanceof File) && img !== null)
//         );
        
//         // Set existingImages property for the API
//         eventDataCopy.existingImages = existingImages;
//         console.log("Extracted existing images from images array:", existingImages);
//       } else {
//         // Ensure we always have an existingImages array
//         eventDataCopy.existingImages = [];
//       }
      
//       // Log what's being sent to the service
//       console.log("Updating event with ID:", id);
//       console.log("Update payload:", eventDataCopy);
      
//       // Call the service method with the properly structured data
//       const result = await EventService.updateEvent(id, eventDataCopy);
      
//       console.log("Update successful:", result);
//       setShowForm(false);
//       setEditingEvent(null);
//       fetchEvents();
//     } catch (err) {
//       console.error("Failed to update event:", err);
//       alert(`Update failed: ${err.message || 'Unknown error'}`);
//     }
//   };

//   const handleDeleteEvent = async (id) => {
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       try {
//         await EventService.deleteEvent(id);
//         fetchEvents();
//       } catch (err) {
//         console.error("Failed to delete event:", err);
//         alert("Failed to delete event. Please try again.");
//       }
//     }
//   };

//   const openEventForm = (event = null) => {
//     // Make a deep copy of the event to prevent direct state mutations
//     if (event) {
//       // Create a correctly structured event object for editing
//       const formattedEvent = {
//         ...event,
//         // Ensure images is properly structured for the form
//         images: event.images ? event.images.map((img, idx) => {
//           if (typeof img === 'string') {
//             return img;
//           } else if (typeof img === 'object' && img !== null) {
//             return img.src || getImageUrl(img, idx, event._id);
//           }
//           return getImageUrl(img, idx, event._id);
//         }) : []
//       };
//       setEditingEvent(formattedEvent);
//     } else {
//       setEditingEvent(null);
//     }
//     setShowForm(true);
//   };

//   const openEventGallery = (event) => {
//     setSelectedEvent(event);
//     setSelectedImageIndex(null);
//   };

//   const closeEventGallery = () => {
//     setSelectedEvent(null);
//     setSelectedImageIndex(null);
//   };

//   const openFullScreen = (index) => {
//     setSelectedImageIndex(index);
//   };

//   const nextImage = () => {
//     if (selectedEvent && selectedImageIndex < selectedEvent.images.length - 1) {
//       setSelectedImageIndex(selectedImageIndex + 1);
//     }
//   };

//   const prevImage = () => {
//     if (selectedEvent && selectedImageIndex > 0) {
//       setSelectedImageIndex(selectedImageIndex - 1);
//     }
//   };

//   // Improved getImageUrl function that works consistently
//   const getImageUrl = (image, idx, eventId) => {
//     if (!image) return '';
    
//     if (typeof image === 'string') {
//       // Handle string URLs
//       if (image.startsWith('/api/')) {
//         return `http://localhost:5000${image}`;                      //change the url loaclhost
//       }
//       return image;
//     } else if (image.src) {
//       // Handle object with src property
//       return getImageUrl(image.src, idx, eventId);
//     } else if (eventId) {
//       // For database-stored images
//       return `http://localhost:5000/api/events/image/${eventId}/${idx}`;
//     }
    
//     // Fallback
//     return '';
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading events...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
//         <div className="text-xl text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 min-h-screen bg-gray-100">
//       <motion.h1
//         className="text-4xl font-bold text-center my-5 text-gray-800"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         College Events
//       </motion.h1>

//       <motion.p
//         className="text-lg text-center text-gray-600 mb-10"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5 }}
//       >
//         Explore the highlights of academic events, conferences, and workshops.
//       </motion.p>

//       {/* Add Event Button (Only for Admin) */}
//       {user?.role === "admin" && (
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={() => openEventForm()}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus size={20} />
//             Add New Event
//           </button>
//         </div>
//       )}

//       {/* Events List */}
//       <div className="space-y-10">
//         {events.length === 0 ? (
//           <div className="text-center text-gray-500 py-10">
//             No events available. Add your first event!
//           </div>
//         ) : (
//           events.map((event, index) => (
//             <motion.div
//               key={event._id}
//               className={`bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
//               initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.2 }}
//               viewport={{ once: false, amount: 0.2 }}
//             >
//               <div className="md:w-1/2">
//                 <h2 className="text-2xl font-semibold text-gray-800">{event.title}</h2>
//                 <p className="text-gray-500 text-sm">{event.date} • {event.venue}</p>
//                 <pre className="mt-3 font-sans whitespace-pre-wrap text-gray-600">{event.description}</pre>

//                 {/* Admin Controls (Only for Admin) */}
//                 {user?.role === "admin" && (
//                   <div className="mt-4 flex gap-3">
//                     <button
//                       onClick={() => openEventForm(event)}
//                       className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
//                     >
//                       <Edit size={18} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteEvent(event._id)}
//                       className="flex items-center gap-1 text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={18} />
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="md:w-1/2 grid grid-cols-2 gap-2 relative">
//                 {event.images && event.images.length > 0 ? (
//                   <>
//                     {event.images.slice(0, 4).map((image, idx) => (
//                       <motion.div
//                         key={idx}
//                         className="h-32 rounded-lg overflow-hidden shadow-md cursor-pointer relative"
//                         whileHover={{ scale: 1.05 }}
//                         onClick={() => {
//                           openEventGallery(event);
//                           openFullScreen(idx);
//                         }}
//                       >
//                         <img
//                           src={getImageUrl(image, idx, event._id)}
//                           alt={typeof image === 'object' ? image.alt || `Event image ${idx + 1}` : `Event image ${idx + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </motion.div>
//                     ))}
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
//                       <button
//                         className="text-white text-lg font-semibold px-4 py-2 bg-blue-600 rounded-lg"
//                         onClick={() => openEventGallery(event)}
//                       >
//                         View All Photos
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg">
//                     <p className="text-gray-500">No images available</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {/* Event Form Modal */}
//       <AnimatePresence>
//         {showForm && (
//           <EventForm
//             event={editingEvent}
//             onSubmit={editingEvent ? (data) => handleUpdateEvent(editingEvent._id, data) : handleCreateEvent}
//             onCancel={() => {
//               setShowForm(false);
//               setEditingEvent(null);
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* Image Gallery Modal */}
//       <AnimatePresence>
//         {selectedEvent && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 px-5">
//             <button
//               className="absolute top-5 right-5 text-white hover:text-gray-300 z-20"
//               onClick={closeEventGallery}
//             >
//               <X size={30} />
//             </button>

//             {/* Show Image Grid if No Image is Selected (Now Scrollable) */}
//             {selectedImageIndex === null ? (
//               <div className="w-full h-full flex items-center justify-center overflow-hidden">
//                 <motion.div
//                   className="w-full max-h-full overflow-y-auto py-10 px-5"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                 >
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
//                     {selectedEvent.images.map((image, idx) => (
//                       <motion.div
//                         key={idx}
//                         className="cursor-pointer rounded-lg overflow-hidden shadow-lg aspect-square"
//                         whileHover={{ scale: 1.05 }}
//                         onClick={() => openFullScreen(idx)}
//                       >
//                         <img
//                           src={getImageUrl(image, idx, selectedEvent._id)}
//                           alt={typeof image === 'object' ? image.alt || `Event image ${idx + 1}` : `Event image ${idx + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               </div>
//             ) : (
//               // Show Full-Screen Image if an Image is Selected
//               <div className="relative flex items-center justify-center w-full h-full">
//                 <button
//                   className="absolute left-5 text-white hover:text-gray-300 z-10"
//                   onClick={prevImage}
//                   disabled={selectedImageIndex === 0}
//                 >
//                   <ChevronLeft size={40} className={selectedImageIndex === 0 ? "opacity-50" : "opacity-100"} />
//                 </button>
//                 <motion.img
//                   key={selectedImageIndex}
//                   src={getImageUrl(selectedEvent.images[selectedImageIndex], selectedImageIndex, selectedEvent._id)}
//                   alt={typeof selectedEvent.images[selectedImageIndex] === 'object' 
//                     ? selectedEvent.images[selectedImageIndex].alt || `Event image ${selectedImageIndex + 1}` 
//                     : `Event image ${selectedImageIndex + 1}`}
//                   className="max-w-full max-h-full object-contain rounded-lg"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                 />
//                 <button
//                   className="absolute right-5 text-white hover:text-gray-300 z-10"
//                   onClick={nextImage}
//                   disabled={selectedImageIndex === selectedEvent.images.length - 1}
//                 >
//                   <ChevronRight size={40} className={selectedImageIndex === selectedEvent.images.length - 1 ? "opacity-50" : "opacity-100"} />
//                 </button>
//                 <div className="absolute bottom-5 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
//                   {selectedImageIndex + 1} / {selectedEvent.images.length}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Events;




import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import EventService from "../services/EventService";
import EventForm from "../components/EventForm"; 
import { AuthContext } from "../context/AuthContext";
import API_URL from "../config"; // Import the API_URL from config file

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add this effect to prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await EventService.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await EventService.createEvent(eventData);
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleUpdateEvent = async (id, eventData) => {
    try {
      // Create a clean copy of the event data
      const eventDataCopy = { ...eventData };
      
      // Ensure we have the correct fields structure for the API
      console.log("Original update data:", eventDataCopy);
      
      // Process existing images - ensure we're using them correctly
      if (eventDataCopy.existingImages && Array.isArray(eventDataCopy.existingImages)) {
        // Already properly structured from EventForm
        console.log("Using existing images from form:", eventDataCopy.existingImages);
      } else if (eventDataCopy.images && Array.isArray(eventDataCopy.images)) {
        // Extract existing images (those that are strings or have URLs)
        const existingImages = eventDataCopy.images.filter(img => 
          typeof img === 'string' || 
          (typeof img === 'object' && !(img instanceof File) && img !== null)
        );
        
        // Set existingImages property for the API
        eventDataCopy.existingImages = existingImages;
        console.log("Extracted existing images from images array:", existingImages);
      } else {
        // Ensure we always have an existingImages array
        eventDataCopy.existingImages = [];
      }
      
      // Log what's being sent to the service
      console.log("Updating event with ID:", id);
      console.log("Update payload:", eventDataCopy);
      
      // Call the service method with the properly structured data
      const result = await EventService.updateEvent(id, eventDataCopy);
      
      console.log("Update successful:", result);
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Failed to update event:", err);
      alert(`Update failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await EventService.deleteEvent(id);
        fetchEvents();
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const openEventForm = (event = null) => {
    // Make a deep copy of the event to prevent direct state mutations
    if (event) {
      // Create a correctly structured event object for editing
      const formattedEvent = {
        ...event,
        // Ensure images is properly structured for the form
        images: event.images ? event.images.map((img, idx) => {
          if (typeof img === 'string') {
            return img;
          } else if (typeof img === 'object' && img !== null) {
            return img.src || getImageUrl(img, idx, event._id);
          }
          return getImageUrl(img, idx, event._id);
        }) : []
      };
      setEditingEvent(formattedEvent);
    } else {
      setEditingEvent(null);
    }
    setShowForm(true);
  };

  const openEventGallery = (event) => {
    setSelectedEvent(event);
    setSelectedImageIndex(null);
  };

  const closeEventGallery = () => {
    setSelectedEvent(null);
    setSelectedImageIndex(null);
  };

  const openFullScreen = (index) => {
    setSelectedImageIndex(index);
  };

  const nextImage = () => {
    if (selectedEvent && selectedImageIndex < selectedEvent.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedEvent && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Updated getImageUrl function that uses API_URL from config
  const getImageUrl = (image, idx, eventId) => {
    if (!image) return '';
    
    if (typeof image === 'string') {
      // Handle string URLs
      if (image.startsWith('/api/')) {
        // Get the base URL without the trailing '/api'
        const baseUrl = API_URL.replace(/\/api$/, '');
        return `${baseUrl}${image}`;
      }
      return image;
    } else if (image.src) {
      // Handle object with src property
      return getImageUrl(image.src, idx, eventId);
    } else if (eventId) {
      // For database-stored images
      // Get the base URL without the trailing '/api'
      const baseUrl = API_URL.replace(/\/api$/, '');
      return `${baseUrl}/api/events/image/${eventId}/${idx}`;
    }
    
    // Fallback
    return '';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <motion.h1
        className="text-4xl font-bold text-center my-5 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        College Events
      </motion.h1>

      <motion.p
        className="text-lg text-center text-gray-600 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Explore the highlights of academic events, conferences, and workshops.
      </motion.p>

      {/* Add Event Button (Only for Admin) */}
      {user?.role === "admin" && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => openEventForm()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add New Event
          </button>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-10">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No events available. Add your first event!
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event._id}
              className={`bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-800">{event.title}</h2>
                <p className="text-gray-500 text-sm">{event.date} • {event.venue}</p>
                <pre className="mt-3 font-sans whitespace-pre-wrap text-gray-600">{event.description}</pre>

                {/* Admin Controls (Only for Admin) */}
                {user?.role === "admin" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => openEventForm(event)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="md:w-1/2 grid grid-cols-2 gap-2 relative">
                {event.images && event.images.length > 0 ? (
                  <>
                    {event.images.slice(0, 4).map((image, idx) => (
                      <motion.div
                        key={idx}
                        className="h-32 rounded-lg overflow-hidden shadow-md cursor-pointer relative"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          openEventGallery(event);
                          openFullScreen(idx);
                        }}
                      >
                        <img
                          src={getImageUrl(image, idx, event._id)}
                          alt={typeof image === 'object' ? image.alt || `Event image ${idx + 1}` : `Event image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="text-white text-lg font-semibold px-4 py-2 bg-blue-600 rounded-lg"
                        onClick={() => openEventGallery(event)}
                      >
                        View All Photos
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showForm && (
          <EventForm
            event={editingEvent}
            onSubmit={editingEvent ? (data) => handleUpdateEvent(editingEvent._id, data) : handleCreateEvent}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 px-5">
            <button
              className="absolute top-5 right-5 text-white hover:text-gray-300 z-20"
              onClick={closeEventGallery}
            >
              <X size={30} />
            </button>

            {/* Show Image Grid if No Image is Selected (Now Scrollable) */}
            {selectedImageIndex === null ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <motion.div
                  className="w-full max-h-full overflow-y-auto py-10 px-5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {selectedEvent.images.map((image, idx) => (
                      <motion.div
                        key={idx}
                        className="cursor-pointer rounded-lg overflow-hidden shadow-lg aspect-square"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openFullScreen(idx)}
                      >
                        <img
                          src={getImageUrl(image, idx, selectedEvent._id)}
                          alt={typeof image === 'object' ? image.alt || `Event image ${idx + 1}` : `Event image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              // Show Full-Screen Image if an Image is Selected
              <div className="relative flex items-center justify-center w-full h-full">
                <button
                  className="absolute left-5 text-white hover:text-gray-300 z-10"
                  onClick={prevImage}
                  disabled={selectedImageIndex === 0}
                >
                  <ChevronLeft size={40} className={selectedImageIndex === 0 ? "opacity-50" : "opacity-100"} />
                </button>
                <motion.img
                  key={selectedImageIndex}
                  src={getImageUrl(selectedEvent.images[selectedImageIndex], selectedImageIndex, selectedEvent._id)}
                  alt={typeof selectedEvent.images[selectedImageIndex] === 'object' 
                    ? selectedEvent.images[selectedImageIndex].alt || `Event image ${selectedImageIndex + 1}` 
                    : `Event image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                />
                <button
                  className="absolute right-5 text-white hover:text-gray-300 z-10"
                  onClick={nextImage}
                  disabled={selectedImageIndex === selectedEvent.images.length - 1}
                >
                  <ChevronRight size={40} className={selectedImageIndex === selectedEvent.images.length - 1 ? "opacity-50" : "opacity-100"} />
                </button>
                <div className="absolute bottom-5 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {selectedEvent.images.length}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;