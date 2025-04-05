

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { createStaff, getStaffById, updateStaff } from '../services/staffService';

// const StaffForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = !!id;

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     title: '',
//     qualifications: '',
//     about: '',
//     profileImage: null,
//     achievements: [],
//     history: [],
//     timeline: []
//   });

//   // Preview image state
//   const [imagePreview, setImagePreview] = useState(null);
  
//   // Loading and error states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch staff data if in edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       const fetchStaffData = async () => {
//         try {
//           setLoading(true);
//           const staffData = await getStaffById(id);
          
//           // Set form data with retrieved staff
//           setFormData({
//             name: staffData.name,
//             title: staffData.title,
//             qualifications: staffData.qualifications,
//             about: staffData.about,
//             profileImage: null, // Don't set the file object for existing image
//             achievements: staffData.achievements || [],
//             history: staffData.history || [],
//             timeline: staffData.timeline || []
//           });
          
//           // Set image preview if there's an existing image
//           if (staffData.profileImage) {
//             setImagePreview(`http://localhost:5000${staffData.profileImage}`);       // change the url
//           }
          
//           setLoading(false);
//         } catch (error) {
//           console.error('Error fetching staff data:', error);
//           setError('Failed to load staff data');
//           setLoading(false);
//         }
//       };
      
//       fetchStaffData();
//     }
//   }, [id, isEditMode]);

//   // Handle text input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, profileImage: file });
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Dynamic array fields handling (achievements, history, timeline)
//   const handleArrayFieldChange = (field, index, key, value) => {
//     const updatedArray = [...formData[field]];
//     updatedArray[index] = { ...updatedArray[index], [key]: value };
//     setFormData({ ...formData, [field]: updatedArray });
//   };

//   // Add new item to an array field
//   const addArrayItem = (field, defaultItem) => {
//     setFormData({
//       ...formData,
//       [field]: [...formData[field], defaultItem]
//     });
//   };

//   // Remove item from an array field
//   const removeArrayItem = (field, index) => {
//     const updatedArray = formData[field].filter((_, i) => i !== index);
//     setFormData({ ...formData, [field]: updatedArray });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       if (isEditMode) {
//         await updateStaff(id, formData);
//       } else {
//         await createStaff(formData);
//       }
      
//       // Navigate back to staff list on success
//       navigate('/admin/staff');
//     } catch (error) {
//       console.error('Error saving staff:', error);
//       setError('Failed to save staff profile. Please check all fields and try again.');
//       setLoading(false);
//     }
//   };

//   if (loading && isEditMode) {
//     return <div className="text-center py-10">Loading staff data...</div>;
//   }

//   return (
//     <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Staff Profile' : 'Create New Staff Profile'}</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-2">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border rounded-md"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block mb-2">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border rounded-md"
//               required
//             />
//           </div>
//         </div>
        
//         <div>
//           <label className="block mb-2">Qualifications</label>
//           <input
//             type="text"
//             name="qualifications"
//             value={formData.qualifications}
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 border rounded-md"
//             required
//           />
//         </div>
        
//         <div>
//           <label className="block mb-2">About</label>
//           <textarea
//             name="about"
//             value={formData.about}
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 border rounded-md"
//             rows="4"
//             required
//           />
//         </div>
        
//         {/* Profile Image */}
//         <div>
//           <label className="block mb-2">Profile Image</label>
//           <input
//             type="file"
//             name="profileImage"
//             onChange={handleFileChange}
//             className="w-full px-4 py-2 border rounded-md"
//             accept="image/*"
//           />
          
//           {imagePreview && (
//             <div className="mt-2">
//               <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
//             </div>
//           )}
//         </div>
        
//         {/* Timeline Section */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          
//           {formData.timeline.map((item, index) => (
//             <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
//                 <div>
//                   <label className="block mb-1">Year</label>
//                   <input
//                     type="text"
//                     value={item.year || ''}
//                     onChange={(e) => handleArrayFieldChange('timeline', index, 'year', e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={item.title || ''}
//                     onChange={(e) => handleArrayFieldChange('timeline', index, 'title', e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md"
//                     required
//                   />
//                 </div>
                
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem('timeline', index)}
//                     className="px-4 py-2 bg-red-500 text-white rounded-md"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block mb-1">Description</label>
//                 <textarea
//                   value={item.description || ''}
//                   onChange={(e) => handleArrayFieldChange('timeline', index, 'description', e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md"
//                   rows="2"
//                   required
//                 />
//               </div>
//             </div>
//           ))}
          
//           <button
//             type="button"
//             onClick={() => addArrayItem('timeline', { year: '', title: '', description: '' })}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             Add Timeline Entry
//           </button>
//         </div>
        
//         {/* Achievements Section - Optional but included for completeness */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          
//           {formData.achievements.map((item, index) => (
//             <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
//                 <div>
//                   <label className="block mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={item.title || ''}
//                     onChange={(e) => handleArrayFieldChange('achievements', index, 'title', e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block mb-1">Icon</label>
//                   <input
//                     type="text"
//                     value={item.icon || ''}
//                     onChange={(e) => handleArrayFieldChange('achievements', index, 'icon', e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md"
//                     placeholder="e.g. trophy, medal, certificate"
//                   />
//                 </div>
//               </div>
              
//               <div className="mb-2">
//                 <label className="block mb-1">Description</label>
//                 <textarea
//                   value={item.desc || ''}
//                   onChange={(e) => handleArrayFieldChange('achievements', index, 'desc', e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md"
//                   rows="2"
//                 />
//               </div>
              
//               <button
//                 type="button"
//                 onClick={() => removeArrayItem('achievements', index)}
//                 className="px-4 py-2 bg-red-500 text-white rounded-md"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
          
//           <button
//             type="button"
//             onClick={() => addArrayItem('achievements', { title: '', icon: '', desc: '' })}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             Add Achievement
//           </button>
//         </div>
        
//         {/* History Section - Optional but included for completeness */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">History</h2>
          
//           {formData.history.map((item, index) => (
//             <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
//               <div>
//                 <label className="block mb-1">Title</label>
//                 <input
//                   type="text"
//                   value={item.title || ''}
//                   onChange={(e) => handleArrayFieldChange('history', index, 'title', e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md"
//                 />
//               </div>
              
//               <div className="mb-2 mt-2">
//                 <label className="block mb-1">Description</label>
//                 <textarea
//                   value={item.desc || ''}
//                   onChange={(e) => handleArrayFieldChange('history', index, 'desc', e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md"
//                   rows="2"
//                 />
//               </div>
              
//               <button
//                 type="button"
//                 onClick={() => removeArrayItem('history', index)}
//                 className="px-4 py-2 bg-red-500 text-white rounded-md"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
          
//           <button
//             type="button"
//             onClick={() => addArrayItem('history', { title: '', desc: '' })}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             Add History Entry
//           </button>
//         </div>
        
//         {/* Submit Button */}
//         <div className="mt-8">
//           <button
//             type="submit"
//             className="px-6 py-3 bg-green-500 text-white rounded-md"
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : (isEditMode ? 'Update Profile' : 'Create Profile')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default StaffForm;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createStaff, getStaffById, updateStaff } from '../services/staffService';
import API_URL from '../config';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    qualifications: '',
    about: '',
    profileImage: null,
    achievements: [],
    history: [],
    timeline: []
  });

  // Preview image state
  const [imagePreview, setImagePreview] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch staff data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchStaffData = async () => {
        try {
          setLoading(true);
          const staffData = await getStaffById(id);
          
          // Set form data with retrieved staff
          setFormData({
            name: staffData.name,
            title: staffData.title,
            qualifications: staffData.qualifications,
            about: staffData.about,
            profileImage: null, // Don't set the file object for existing image
            achievements: staffData.achievements || [],
            history: staffData.history || [],
            timeline: staffData.timeline || []
          });
          
          // Set image preview if there's an existing image
          if (staffData.profileImage) {
            setImagePreview(`${API_URL}${staffData.profileImage}`);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching staff data:', error);
          setError('Failed to load staff data');
          setLoading(false);
        }
      };
      
      fetchStaffData();
    }
  }, [id, isEditMode]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic array fields handling (achievements, history, timeline)
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  // Add new item to an array field
  const addArrayItem = (field, defaultItem) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultItem]
    });
  };

  // Remove item from an array field
  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEditMode) {
        await updateStaff(id, formData);
      } else {
        await createStaff(formData);
      }
      
      // Navigate back to staff list on success
      navigate('/admin/staff');
    } catch (error) {
      console.error('Error saving staff:', error);
      setError('Failed to save staff profile. Please check all fields and try again.');
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-10">Loading staff data...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Staff Profile' : 'Create New Staff Profile'}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-2">Qualifications</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            required
          />
        </div>
        
        {/* Profile Image */}
        <div>
          <label className="block mb-2">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md"
            accept="image/*"
          />
          
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
            </div>
          )}
        </div>
        
        {/* Timeline Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          
          {formData.timeline.map((item, index) => (
            <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block mb-1">Year</label>
                  <input
                    type="text"
                    value={item.year || ''}
                    onChange={(e) => handleArrayFieldChange('timeline', index, 'year', e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleArrayFieldChange('timeline', index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeArrayItem('timeline', index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleArrayFieldChange('timeline', index, 'description', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="2"
                  required
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('timeline', { year: '', title: '', description: '' })}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Timeline Entry
          </button>
        </div>
        
        {/* Achievements Section - Optional but included for completeness */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          
          {formData.achievements.map((item, index) => (
            <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleArrayFieldChange('achievements', index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Icon</label>
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => handleArrayFieldChange('achievements', index, 'icon', e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="e.g. trophy, medal, certificate"
                  />
                </div>
              </div>
              
              <div className="mb-2">
                <label className="block mb-1">Description</label>
                <textarea
                  value={item.desc || ''}
                  onChange={(e) => handleArrayFieldChange('achievements', index, 'desc', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="2"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeArrayItem('achievements', index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('achievements', { title: '', icon: '', desc: '' })}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Achievement
          </button>
        </div>
        
        {/* History Section - Optional but included for completeness */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">History</h2>
          
          {formData.history.map((item, index) => (
            <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleArrayFieldChange('history', index, 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div className="mb-2 mt-2">
                <label className="block mb-1">Description</label>
                <textarea
                  value={item.desc || ''}
                  onChange={(e) => handleArrayFieldChange('history', index, 'desc', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="2"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeArrayItem('history', index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('history', { title: '', desc: '' })}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add History Entry
          </button>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Profile' : 'Create Profile')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;