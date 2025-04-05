
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { getActivities, createActivity, updateActivity, deleteActivity } from "../services/activityService";
import { AuthContext } from "../context/AuthContext";


const SocialActivities = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    title: "",
    desc: "",
    img: null,
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editActivity, setEditActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation
  const [activityToDelete, setActivityToDelete] = useState(null); // Track which activity to delete

  // Fetch all activities
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const data = await getActivities();
      setActivities(data);
      setErrorMessage(""); // Clear error message on successful fetch
    } catch (error) {
      console.error("Error fetching activities:", error);
      setErrorMessage("Failed to load activities. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle input change for new activity
  const handleChange = (e) => {
    setNewActivity({
      ...newActivity,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload for new activity
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewActivity({
        ...newActivity,
        img: e.target.files[0],
      });
    }
  };

  // Error message handling helper
  const handleErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      setErrorMessage(error.response.data.message);
    } else if (error.message) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  // Submit new activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newActivity.title || !newActivity.desc || !newActivity.date) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    if (!newActivity.img) {
      setErrorMessage("Please select an image.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append('title', newActivity.title);
      formData.append('desc', newActivity.desc);
      formData.append('date', newActivity.date);
      if (newActivity.img) {
        formData.append('img', newActivity.img);
      }

      const savedActivity = await createActivity(formData);
      
      // Update activities state with the new activity
      setActivities(prevActivities => [savedActivity, ...prevActivities]);
      
      // Reset form
      setNewActivity({
        title: "",
        desc: "",
        img: null,
        date: "",
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Show success message
      setSuccessMessage("Activity created successfully!");
    } catch (error) {
      console.error("Error creating activity:", error);
      handleErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change for edit form
  const handleEditChange = (e) => {
    setEditActivity({
      ...editActivity,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload for edit activity
  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditActivity({
        ...editActivity,
        img: e.target.files[0],
        imageUpdated: true, // Flag to indicate image was updated
      });
    }
  };

  // Update activity
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editActivity.title || !editActivity.desc || !editActivity.date) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append('title', editActivity.title);
      formData.append('desc', editActivity.desc);
      formData.append('date', editActivity.date);
      
      // Only append image if a new one was selected
      if (editActivity.imageUpdated && editActivity.img) {
        formData.append('img', editActivity.img);
      }

      const updatedActivity = await updateActivity(editActivity._id, formData);
      
      // Update activities state with the updated activity
      setActivities(prevActivities => 
        prevActivities.map(activity => 
          activity._id === updatedActivity._id ? updatedActivity : activity
        )
      );
      
      setEditActivity(null); // Close the edit modal
      setSuccessMessage("Activity updated successfully!");
    } catch (error) {
      console.error("Error updating activity:", error);
      handleErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation
  const confirmDelete = (activity) => {
    setActivityToDelete(activity);
    setShowDeleteConfirm(true);
  };

  // Delete activity without popup confirmation
  const handleDelete = async (id) => {
    setErrorMessage(""); // Clear any previous error messages
    try {
      await deleteActivity(id);
      
      // Update state locally after successful deletion
      setActivities(activities.filter(activity => activity._id !== id));
      setSuccessMessage("Activity deleted successfully!");
      setShowDeleteConfirm(false); // Close the confirmation dialog
      setActivityToDelete(null); // Reset activity to delete
    } catch (error) {
      console.error("Error deleting activity:", error);
      handleErrorMessage(error);
    }
  };

  // Open the modal to view activity details
  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  // Helper function to render image properly
  const renderImage = (img) => {
    if (!img) return 'default_image_url.jpg';
    
    if (img.data && img.contentType) {
      return `data:${img.contentType};base64,${img.data}`;
    }
    
    // If it's a File object (for preview)
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    
    return img.url || img;
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <motion.h1
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold text-center text-gray-800 mb-5"
      >
        Social Activities
      </motion.h1>

      <motion.p
        className="text-center text-gray-600 mb-10 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Our students actively participate in various social and community-based activities to bring positive change.
      </motion.p>

      {/* Success message display */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 max-w-xl mx-auto">
          <p>{successMessage}</p>
          <button 
            className="float-right text-green-700 font-bold" 
            onClick={() => setSuccessMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-xl mx-auto">
          <p>{errorMessage}</p>
          <button 
            className="float-right text-red-700 font-bold" 
            onClick={() => setErrorMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Activity Creation Form - Only visible to admins */}
      {user?.role === "admin" && (
        <div className="mt-10 mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">Add New Activity</h2>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={newActivity.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="desc"
                value={newActivity.desc}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded mt-2"
                required
              />
              {newActivity.img && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Selected file: {newActivity.img.name}</p>
                  <img 
                    src={URL.createObjectURL(newActivity.img)} 
                    alt="Preview" 
                    className="h-32 object-cover mt-2 rounded" 
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={newActivity.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 bg-blue-600 text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {/* Activity List with Animations */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No activities found. Add one to get started!
          </div>
        ) : (
          activities.map((activity, index) => {
            // Animation variants based on index
            const animationVariants = {
              0: { opacity: 0, x: -100 }, // Left to Right
              1: { opacity: 0, scale: 0.8 }, // Small to Big
              2: { opacity: 0, x: 100 }, // Right to Left
            };

            return (
              <motion.div
                key={activity._id || index}
                className="shadow-lg rounded-lg overflow-hidden bg-white relative"
                initial={animationVariants[index % 3]}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: false }}
              >
                {/* Card Content - Click opens details */}
                <div onClick={() => handleViewDetails(activity)} className="cursor-pointer">
                  <div className="relative w-full h-48">
                    <img
                      src={renderImage(activity.img)}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'default_image_url.jpg';
                      }}
                    />
                  </div>
            

<div className="p-4">
  <h2 className="text-xl font-bold">{activity.title}</h2>
  <p className="text-gray-600 mt-2">
    {activity.desc.length > 100 ? `${activity.desc.substring(0, 100)}...` : activity.desc}
  </p>
  <p className="text-blue-600 font-semibold mt-2">
    {new Date(activity.date).toLocaleDateString()}
  </p>
</div>
                </div>

                {/* Admin Controls - Only visible to admins */}
                {user?.role === 'admin' && (
                  <div className="flex justify-between p-4 pt-0">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        // Format date correctly for edit form
                        const formattedActivity = {
                          ...activity,
                          date: activity.date ? activity.date.substring(0, 10) : ''
                        };
                        setEditActivity(formattedActivity); // Set activity to edit
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        confirmDelete(activity); // Show delete confirmation dialog
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* View Details Modal */}
      {showModal && (
        <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-lg bg-white p-8 rounded-xl overflow-y-auto max-h-[75vh]">
              {selectedActivity && (
                <div>
                  <h2 className="text-3xl font-bold mb-4">{selectedActivity.title}</h2>
                  <img
                    src={renderImage(selectedActivity.img)}
                    alt={selectedActivity.title}
                    className="w-full h-60 object-cover mb-4 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'default_image_url.jpg';
                    }}
                  />
                  {/* <p className="mb-4 whitespace-pre-line">{selectedActivity.desc}</p> */}
                  <pre className="mb-4 text-base font-sans whitespace-pre-wrap">{selectedActivity.desc}</pre>
                  <p className="font-semibold text-blue-600">
                    {new Date(selectedActivity.date).toLocaleDateString()}
                  </p>
                  <button
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Edit Modal */}
      {editActivity && (
        <Dialog open={true} onClose={() => setEditActivity(null)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-lg bg-white p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Edit Activity</h2>
              <form onSubmit={handleUpdate} className="w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editActivity.title}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    name="desc"
                    value={editActivity.desc}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded mt-2"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Image</label>
                  {editActivity.img && (
                    <img
                      src={renderImage(editActivity.img)}
                      alt="Current"
                      className="h-32 object-cover mt-2 rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'default_image_url.jpg';
                      }}
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Upload New Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full p-3 border border-gray-300 rounded mt-2"
                  />
                  {editActivity.imageUpdated && editActivity.img && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">New image selected</p>
                      <img 
                        src={URL.createObjectURL(editActivity.img)} 
                        alt="New Preview" 
                        className="h-32 object-cover mt-2 rounded" 
                      />
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editActivity.date}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="p-3 bg-gray-500 text-white rounded px-6 hover:bg-gray-600 transition"
                    onClick={() => setEditActivity(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-3 bg-blue-600 text-white rounded px-6 hover:bg-blue-700 transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm bg-white p-6 rounded-xl">
              <Dialog.Title className="text-xl font-bold text-gray-800">
                Confirm Deletion
              </Dialog.Title>
              <Dialog.Description className="mt-2 mb-5 text-gray-600">
                Are you sure you want to delete this activity?
              </Dialog.Description>

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(activityToDelete._id)}
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default SocialActivities;  