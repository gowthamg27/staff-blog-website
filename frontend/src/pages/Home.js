


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaChalkboardTeacher, FaAtom, FaUserGraduate, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import API_URL from '../config'





// Animation Variants remain the same
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: -20, transition: { duration: 0.5 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.3 } },
};

// API base URL
const STAFF_API_URL = `${API_URL}/staff`;      //change the url loaclhost only

// Main Component
const Home = () => {
  // Get auth context
  const { isAdmin } = useAuth();


  const [showJourneyForm, setShowJourneyForm] = useState(false);
  // State for staff profile and timeline data
  const [ staffProfile, setStaffProfile] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Section visibility state with a separate state to track unsaved changes
  const [sectionVisibility, setSectionVisibility] = useState({
    profile: true,
    history: true,
    achievements: true,
    journey: true
  });
  
  // Track if there are unsaved visibility changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for about section
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    achievements: []
  });
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  // State for history section
  const [historyData, setHistoryData] = useState([]);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [historyFormData, setHistoryFormData] = useState({ title: "", description: "" });
  const [editHistoryIndex, setEditHistoryIndex] = useState(null);

  // State for achievements section
  const [achievementsData, setAchievementsData] = useState([]);
  const [isEditingAchievement, setIsEditingAchievement] = useState(false);
  const [achievementFormData, setAchievementFormData] = useState({ icon: "", title: "", description: "" });
  const [editAchievementIndex, setEditAchievementIndex] = useState(null);

  // State to manage form inputs for Timeline Create/Update
  const [formData, setFormData] = useState({ year: "", title: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);

  // Function to toggle section visibility (only updates local state)
  const toggleSectionVisibility = (section) => {
    setSectionVisibility({
      ...sectionVisibility,
      [section]: !sectionVisibility[section]
    });
    setHasUnsavedChanges(true);
  };

  // Fetch staff profile data on component mount
  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        setLoading(true);
        // Assuming the first staff member is the professor
        const response = await axios.get(STAFF_API_URL);
        if (response.data && response.data.length > 0) {
          const professor = response.data[0]; // Get the first staff profile
          setStaffProfile(professor);
          setTimelineData(professor.timeline || []);
          setHistoryData(professor.history || []);
          setAchievementsData(professor.achievements || []);
          
          // Set about data
          setAboutData({
            title: professor.title || "",
            description: professor.about || "",
            achievements: []
          });
        } else {
          // If no staff profiles exist yet, create a default one
          createDefaultProfile();
        }
      } catch (error) {
        console.error('Error fetching staff profile:', error);
        setError('Failed to load profile data');
        // If API fails, use default data
        createDefaultProfile();
      } finally {
        setLoading(false);
      }
    };

    fetchStaffProfile();
  }, []);

  // Fetch visibility settings separately
  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const res = await axios.get(`${STAFF_API_URL}/visibility`);
        
        setSectionVisibility(res.data);
      } catch (error) {
        console.error("Error fetching visibility:", error);
      }
    };
  
    fetchVisibility();
  }, []);
  
  // Create a default profile if none exists
  const createDefaultProfile = async () => {
    const defaultTimeline = [];

    const defaultHistory = [];

    const defaultAchievements = [ ];

    const defaultSectionVisibility = {
      profile: true,
      history: true,
      achievements: true,
      journey: true
    };

    try {
      const defaultProfile = {
        name: "Dr.O.V.Sadhasivam",
        title: "Professor",
        qualifications: "M.Sc.,M.Pil.,Ph.D.",
        about: " ",
        achievements: defaultAchievements,
        history: defaultHistory,
        timeline: defaultTimeline,
        sectionVisibility: defaultSectionVisibility
      };

      // Create a FormData object for the request
      const formData = new FormData();
      formData.append('name', defaultProfile.name);
      formData.append('title', defaultProfile.title);
      formData.append('qualifications', defaultProfile.qualifications);
      formData.append('about', defaultProfile.about);
      formData.append('achievements', JSON.stringify(defaultProfile.achievements));
      formData.append('history', JSON.stringify(defaultProfile.history));
      formData.append('timeline', JSON.stringify(defaultProfile.timeline));
      formData.append('sectionVisibility', JSON.stringify(defaultProfile.sectionVisibility));

      // Create default profile on the backend
      const response = await axios.post(STAFF_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setStaffProfile(response.data.staff);
      setTimelineData(defaultProfile.timeline);
      setHistoryData(defaultProfile.history);
      setAchievementsData(defaultProfile.achievements);
      setSectionVisibility(defaultProfile.sectionVisibility);
      setAboutData({
        title: defaultProfile.title,
        description: defaultProfile.about,
        achievements: []
      });
    } catch (error) {
      console.error('Error creating default profile:', error);
      // If API fails, just use the default data in the UI
      setTimelineData(defaultTimeline);
      setHistoryData(defaultHistory);
      setAchievementsData(defaultAchievements);
      setSectionVisibility({
        profile: true,
        history: true,
        achievements: true,
        journey: true
      });
      setAboutData({
        title: "Professor",
        description: " ",
        achievements: []
      });
    }
  };

  // Save section visibility changes - only called when the Save button is clicked
  const saveSectionVisibility = async () => {
    try {
      await axios.put(`${STAFF_API_URL}/visibility`, {
        sectionVisibility: sectionVisibility,
      });
      // Reset the unsaved changes flag
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating visibility:", error);
      setError("Failed to save visibility settings");
    }
  };
  

  const updateProfileData = async (updatedData) => {
    if (staffProfile && staffProfile._id) {
      try {
        console.log("Updating profile with data:", updatedData);
        
        // Create FormData for the request
        const formData = new FormData();
        formData.append('name', updatedData.name || staffProfile.name);
        formData.append('title', updatedData.title || staffProfile.title);
        formData.append('qualifications', updatedData.qualifications || staffProfile.qualifications);
        formData.append('about', updatedData.about || staffProfile.about);
        
        // Make sure we're properly stringifying these array objects
        const achievements = JSON.stringify(updatedData.achievements || staffProfile.achievements || []);
        const history = JSON.stringify(updatedData.history || staffProfile.history || []);
        const timeline = JSON.stringify(updatedData.timeline || staffProfile.timeline || []);
        
        formData.append('achievements', achievements);
        formData.append('history', history);
        formData.append('timeline', timeline);
        formData.append('sectionVisibility', JSON.stringify(updatedData.sectionVisibility || sectionVisibility));
        
        console.log("Sending timeline data:", updatedData.timeline || staffProfile.timeline || []);
        
        const response = await axios.put(`${STAFF_API_URL}/${staffProfile._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log("API response:", response.data);
        setStaffProfile(response.data.staff);
        return true;
      } catch (error) {
        console.error('Error updating profile data:', error.response?.data || error.message || error);
        setError('Failed to update profile data');
        return false;
      }
    }
    console.error("Cannot update: No staff profile or ID");
    return false;
  };

  // Handle form input changes for Timeline
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle About section input changes
  const handleAboutInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData({ ...aboutData, [name]: value });
  };

  // Handle saving About section changes
  const handleSaveAbout = async () => {
    const success = await updateProfileData({
      title: aboutData.title,
      about: aboutData.description
    });
    
    if (success) {
      setIsEditingAbout(false);
    }
  };

  // Handle History form input changes
  const handleHistoryInputChange = (e) => {
    const { name, value } = e.target;
    setHistoryFormData({ ...historyFormData, [name]: value });
  };

  // Handle Add History
  const handleAddHistory = async () => {
    if (historyFormData.title && historyFormData.description) {
      try {
        const newHistory = [...historyData, historyFormData];
        
        const success = await updateProfileData({
          history: newHistory
        });
        
        if (success) {
          setHistoryData(newHistory);
          setHistoryFormData({ title: "", description: "" });
        }
      } catch (error) {
        console.error('Error adding history entry:', error);
        setError('Failed to add history');
      }
    }
  };

  // Handle Edit History
  const handleEditHistory = (index) => {
    setEditHistoryIndex(index);
    setHistoryFormData(historyData[index]);
    setIsEditingHistory(true);
  };

  // Handle Update History
  const handleUpdateHistory = async () => {
    if (historyFormData.title && historyFormData.description) {
      try {
        const updatedHistory = [...historyData];
        updatedHistory[editHistoryIndex] = historyFormData;
        
        const success = await updateProfileData({
          history: updatedHistory
        });
        
        if (success) {
          setHistoryData(updatedHistory);
          setHistoryFormData({ title: "", description: "" });
          setEditHistoryIndex(null);
          setIsEditingHistory(false);
        }
      } catch (error) {
        console.error('Error updating history entry:', error);
        setError('Failed to update history');
      }
    }
  };

  // Handle Delete History
  const handleDeleteHistory = async (index) => {
    try {
      const updatedHistory = historyData.filter((_, i) => i !== index);
      
      const success = await updateProfileData({
        history: updatedHistory
      });
      
      if (success) {
        setHistoryData(updatedHistory);
      }
    } catch (error) {
      console.error('Error deleting history entry:', error);
      setError('Failed to delete history');
    }
  };

  // Handle Achievement form input changes
  const handleAchievementInputChange = (e) => {
    const { name, value } = e.target;
    setAchievementFormData({ ...achievementFormData, [name]: value });
  };

  // Handle Add Achievement
  const handleAddAchievement = async () => {
    if (achievementFormData.title && achievementFormData.description) {
      try {
        const newAchievements = [...achievementsData, achievementFormData];
        
        const success = await updateProfileData({
          achievements: newAchievements
        });
        
        if (success) {
          setAchievementsData(newAchievements);
          setAchievementFormData({ icon: "", title: "", description: "" });
        }
      } catch (error) {
        console.error('Error adding achievement:', error);
        setError('Failed to add achievement');
      }
    }
  };

  // Handle Edit Achievement
  const handleEditAchievement = (index) => {
    setEditAchievementIndex(index);
    setAchievementFormData(achievementsData[index]);
    setIsEditingAchievement(true);
  };

  // Handle Update Achievement
  const handleUpdateAchievement = async () => {
    if (achievementFormData.title && achievementFormData.description) {
      try {
        const updatedAchievements = [...achievementsData];
        updatedAchievements[editAchievementIndex] = achievementFormData;
        
        const success = await updateProfileData({
          achievements: updatedAchievements
        });
        
        if (success) {
          setAchievementsData(updatedAchievements);
          setAchievementFormData({ icon: "", title: "", description: "" });
          setEditAchievementIndex(null);
          setIsEditingAchievement(false);
        }
      } catch (error) {
        console.error('Error updating achievement:', error);
        setError('Failed to update achievement');
      }
    }
  };

  // Handle Delete Achievement
  const handleDeleteAchievement = async (index) => {
    try {
      const updatedAchievements = achievementsData.filter((_, i) => i !== index);
      
      const success = await updateProfileData({
        achievements: updatedAchievements
      });
      
      if (success) {
        setAchievementsData(updatedAchievements);
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      setError('Failed to delete achievement');
    }
  };


  const handleAddJourney = async () => {
    if (formData.year && formData.title && formData.description) {
      try {
        console.log("Adding journey with data:", formData);
        const newTimelineEntry = {
          year: formData.year,
          title: formData.title,
          description: formData.description
        };
        // const newTimeline = [...timelineData, formData];
        const newTimeline = [...timelineData, newTimelineEntry];
        console.log("New timeline data:", newTimeline);
        
        const success = await updateProfileData({
          timeline: newTimeline
        });
        
        if (success) {
          console.log("Journey added successfully!");
          setTimelineData(newTimeline);
          setFormData({ year: "", title: "", description: "" });
          setShowJourneyForm(false);
        } else {
          console.error("Failed to add journey - API returned failure");
        }
      } catch (error) {
        console.error('Error adding timeline entry:', error);
        setError('Failed to add journey');
      }
    } else {
      console.warn("Form data incomplete:", formData);
    }
  };
  // Handle Edit Journey (Update)
  const handleEditJourney = (index) => {
    setEditIndex(index);
    setFormData(timelineData[index]);
  };

  // Handle Update Journey
  const handleUpdateJourney = async () => {
    if (formData.year && formData.title && formData.description) {
      try {
        const updatedData = [...timelineData];
        updatedData[editIndex] = formData;
        
        const success = await updateProfileData({
          timeline: updatedData
        });
        
        if (success) {
          setTimelineData(updatedData);
          setFormData({ year: "", title: "", description: "" });
          setEditIndex(null); // Reset edit index after update
        }
      } catch (error) {
        console.error('Error updating timeline entry:', error);
        setError('Failed to update journey');
      }
    }
  };

  // Handle Delete Journey
  const handleDeleteJourney = async (index) => {
    try {
      const updatedData = timelineData.filter((_, i) => i !== index);
      
      const success = await updateProfileData({
        timeline: updatedData
      });
      
      if (success) {
        setTimelineData(updatedData);
      }
    } catch (error) {
      console.error('Error deleting timeline entry:', error);
      setError('Failed to delete journey');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Improved VisibilityToggle component - only changes local state, no API calls
  const VisibilityToggle = ({ section, label }) => {
    return (
      <div className="flex items-center mb-2 p-2 bg-gray-100 rounded-md">
        <button
          onClick={() => toggleSectionVisibility(section)}
          className="flex items-center text-sm font-medium"
        >
          {sectionVisibility[section] ? (
            <FaEye className="text-green-500 mr-2" />
          ) : (
            <FaEyeSlash className="text-red-500 mr-2" />
          )}
          {label}: {sectionVisibility[section] ? "Visible" : "Hidden"}
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      {/* Admin Section Visibility Controls */}
      {isAdmin && (
        <motion.div
          className="admin-controls bg-white p-4 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-blue-700 mb-3">Section Visibility Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <VisibilityToggle section="profile" label="Profile Section" />
            <VisibilityToggle section="history" label="History Section" />
            <VisibilityToggle section="achievements" label="Achievements Section" />
            <VisibilityToggle section="journey" label="Journey Section" />
          </div>
          <button
            onClick={saveSectionVisibility}
            className={`mt-4 px-4 py-2 ${hasUnsavedChanges ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md hover:bg-blue-600 transition`}
            disabled={!hasUnsavedChanges}
          >
            {hasUnsavedChanges ? "Save Visibility Settings" : "No Changes to Save"}
          </button>
          {hasUnsavedChanges && (
            <p className="text-sm text-yellow-600 mt-2">
              You have unsaved visibility changes. Click "Save Visibility Settings" to apply them.
            </p>
          )}
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.div
        className="hero-section h-[30vh] flex flex-col justify-center items-center text-center bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeInUp}
      >
        <h1 className="text-3xl font-bold text-gray-200  mb-1">{ "Associate Professor"}</h1> {/* Banner h1 name*/}
        <h3 className="text-2xl font-bold text-gray-200 mb-1">{ "Head of the Department of PG & Research Department of Mathematies"}</h3> {/* Banner body name*/}
        <p className="text-3xl font-bold text-gray-300">{ "Thiruvalluvar Government Arts College | Rasipuram |Tamilnadu | India"}</p> {/* Banne body name*/}
        
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      {/* Profile Section */}
      {sectionVisibility.profile && (
        <motion.section
          className="profile-section flex flex-col md:flex-row items-center gap-8 p-6 mb-5 bg-white rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={staggerContainer}
        >
          <motion.div className="profile-image w-full md:w-1/3 rounded-lg overflow-hidden shadow-lg" variants={zoomIn}>
            <img
              src="/assets/images/prs1.jpg"
              alt={staffProfile?.name || "Professor"}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
            />
          </motion.div>

          {/* About section */}
          <motion.div className="profile-details w-full md:w-2/3 text-center md:text-left relative z-10" variants={fadeInRight}>
            {isEditingAbout && isAdmin ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-blue-700 mb-4">Edit About Section</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={aboutData.title}
                    onChange={handleAboutInputChange}
                    placeholder="Title"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <textarea
                    name="description"
                    value={aboutData.description}
                    onChange={handleAboutInputChange}
                    placeholder="Description"
                    className="w-full px-4 py-2 border rounded-md min-h-32"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveAbout}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAbout(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                {/* staffProfile?.name || */}
                  {/* <h2 className="text-3xl font-bold text-blue-700">Meet { "Dr.O.V.Sadhasivam M.Sc.,M.Pil.,Ph.D."}</h2> */}
                  <h2 className="text-3xl font-bold text-blue-700">
  Meet Dr.O.V.Sadhasivam <span className="text-lg font-medium">M.Sc., M.Phil., Ph.D.</span>
</h2>

                  {isAdmin && (
                    <button
                      onClick={() => setIsEditingAbout(true)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <h6 className='text-2xl  font-bold text-blue-800'> Associate Professor</h6>
                <pre className="whitespace-pre-wrap text-gray-700 mt-3 font-sans text-base leading-relaxed">
                  {staffProfile?.about || aboutData.description}
                </pre>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center"><FaAtom className="text-blue-600 mr-2" /> Led the Quantum Entanglement Project</li>
                  <li className="flex items-center"><FaChalkboardTeacher className="text-blue-600 mr-2" /> Mentored over 50+ PhD Scholars</li>
                  <li className="flex items-center"><FaUserGraduate className="text-blue-600 mr-2" /> Awarded National Science Medal</li>
                </ul>
              </>
            )}
          </motion.div>
        </motion.section>
      )}

      {/* Landscape image */}
      <motion.div 
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.5 }}
        className="flex justify-center items-center mb-10 text-lg relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white">
        <img
          src="/assets/images/bgc1.jpg"
          alt={staffProfile?.name || "Professor"}
          className="w-50 max-h-[1000px]"
        />
      </motion.div> 

      {/* History Section */}
      {sectionVisibility.history && (
        <motion.section
          className="history-section bg-white p-6 rounded-lg shadow-md mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
          viewport={{ once: false }}
        >
          {/* Rest of the history section content... */}
          {/* Section Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center w-full">
              <h2 className="text-4xl font-bold text-blue-700 tracking-wide">History</h2>
              <p className="text-gray-600 mt-2 text-lg mb-5">
                A journey of excellence, innovation, and global impact.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsEditingHistory(!isEditingHistory)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isEditingHistory ? "Cancel" : "Add History"}
              </button>
            )}
          </div>

          {/* Add/Edit History Form */}
          {isEditingHistory && isAdmin && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                {editHistoryIndex !== null ? "Edit History Item" : "Add New History Item"}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editHistoryIndex !== null ? handleUpdateHistory() : handleAddHistory();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="title"
                  value={historyFormData.title}
                  onChange={handleHistoryInputChange}
                  placeholder="Title (e.g., 🎓 Academic Foundations)"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
                <textarea
                  name="description"
                  value={historyFormData.description}
                  onChange={handleHistoryInputChange}
                  placeholder="Description"
                  className="w-full px-4 py-2 border rounded-md min-h-20"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {editHistoryIndex !== null ? "Update History" : "Add History"}
                </button>
              </form>
            </div>
          )}

    

          {/* History Content */}
          <div className="space-y-4">
            {historyData.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, delay: index * 0.1 } }}
                viewport={{ once: false }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditHistory(index)}
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHistory(index)}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <pre className="mt-2 whitespace-pre-wrap font-sans  text-gray-600">{item.description}</pre>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}


     {/* Achievements Section */}
{sectionVisibility.achievements && (
  <motion.section
    className="achievements-section bg-white p-6 rounded-lg shadow-md mb-10"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.2 }}
    variants={staggerContainer}
  >
    {/* Section Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="text-center w-full">
        <h2 className="text-4xl font-bold tracking-wide text-blue-700">
          Notable Achievements
        </h2>
        <p className="text-lg text-gray-600 mt-1 mb-5">
          Recognizing milestones of innovation and excellence.
        </p>
      </div>
      {isAdmin && (
        <button
          onClick={() => setIsEditingAchievement(!isEditingAchievement)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isEditingAchievement ? "Cancel" : "Add Achievement"}
        </button>
      )}
    </div>

    {/* Add/Edit Achievement Form */}
    {isEditingAchievement && isAdmin && (
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
        <h3 className="text-2xl font-semibold text-blue-700 mb-4">
          {editAchievementIndex !== null ? "Edit Achievement" : "Add New Achievement"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editAchievementIndex !== null ? handleUpdateAchievement() : handleAddAchievement();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="icon"
            value={achievementFormData.icon}
            onChange={handleAchievementInputChange}
            placeholder="Icon (e.g., 🏆, 📚, 🔬, 👨‍🏫)"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="title"
            value={achievementFormData.title}
            onChange={handleAchievementInputChange}
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={achievementFormData.description}
            onChange={handleAchievementInputChange}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md min-h-20"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {editAchievementIndex !== null ? "Update Achievement" : "Add Achievement"}
          </button>
        </form>
      </div>
    )}

    {/* Achievements Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievementsData.map((item, index) => (
        <motion.div
          key={index}
          className="relative p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-transform hover:scale-105"
          initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? -80 : 80 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="text-3xl">{item.icon}</div>
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAchievement(index)}
                  className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAchievement(index)}
                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm mt-1">{item.description}</pre>
        </motion.div>
      ))}
    </div>
  </motion.section>
)}

{/* Professional Journey Section */}
{sectionVisibility.journey && (
  <motion.section 
    className="journey-section bg-white p-6 rounded-lg shadow-md mb-10"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
    viewport={{ once: false }}
  >
    {/* Section Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="text-center w-full">
        <h2 className="text-4xl font-bold text-blue-700 tracking-wide">Professional Journey</h2>
        <p className="text-gray-600 mt-2 text-lg mb-5">
          A timeline of significant career milestones and achievements.
        </p>
      </div>
      
      {/* Only show Add Journey button to admins */}
      {isAdmin && (
       <button
       onClick={() => {
         setFormData({ year: "", title: "", description: "" });
         setEditIndex(null);
         setShowJourneyForm(true);
       }}
       className="px-4 py-2 bg-blue-500 text-white rounded-md"
     >
       Add Journey
     </button>
      )}
    </div>

    {/* Add/Edit Journey Form - Only visible to admins */}
    {isAdmin && (editIndex !== null || formData.year !== "" || formData.title !== "" || formData.description !== "" || showJourneyForm) && (
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
        <h3 className="text-2xl font-semibold text-blue-700 mb-4">
          {editIndex !== null ? "Edit Journey Entry" : "Add New Journey Entry"}
        </h3>
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            editIndex !== null ? handleUpdateJourney() : handleAddJourney();
          }}
          className="space-y-4"
        > */}
        <form
  onSubmit={(e) => {
    e.preventDefault(); // This is important!
    editIndex !== null ? handleUpdateJourney() : handleAddJourney();
  }}
  className="space-y-4"
>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Year"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md min-h-20"
            required
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {editIndex !== null ? "Update Journey" : "Add Journey"}
            </button>
            <button
  type="button"
  onClick={() => {
    setFormData({ year: "", title: "", description: "" });
    setEditIndex(null);
    setShowJourneyForm(false);
  }}
  className="px-4 py-2 bg-gray-500 text-white rounded-md"
>
  Cancel
</button>
          </div>
        </form>
      </div>
    )}

    {/* Journey Cards with motion animation */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-5 w-full max-w-6xl mx-auto">
      {timelineData.map((item, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
          className={`p-6 rounded-lg shadow-lg bg-white text-black transition-all duration-300
             hover:bg-black hover:text-white cursor-pointer
             ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} w-full md:w-[90%]`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{item.year} - {item.title}</h3>
            
            {/* Admin controls - only visible to admins */}
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditJourney(index)}
                  className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteJourney(index)}
                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm mt-2">{item.description}</pre>
          </motion.div>
            ))}
          </div>
        </motion.section>
      )}
</div>
)}
export default Home;

