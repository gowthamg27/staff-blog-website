
import axios from 'axios';
import API_URL from '../config';

const STAFF_ENDPOINT = `${API_URL}/api/staff`;

// Create a new staff profile
export const createStaff = async (staffData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append file if it exists
    if (staffData.profileImage) {
      formData.append('profileImage', staffData.profileImage);
    }
    
    // Append text fields
    formData.append('name', staffData.name);
    formData.append('title', staffData.title);
    formData.append('qualifications', staffData.qualifications);
    formData.append('about', staffData.about);
    
    // Convert arrays to JSON strings before appending
    formData.append('achievements', JSON.stringify(staffData.achievements || []));
    formData.append('history', JSON.stringify(staffData.history || []));
    formData.append('timeline', JSON.stringify(staffData.timeline || []));
    
    const response = await axios.post(STAFF_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating staff profile:', error);
    throw error;
  }
};

// Get all staff profiles
export const getAllStaff = async () => {
  try {
    const response = await axios.get(STAFF_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff profiles:', error);
    throw error;
  }
};

// Get a single staff profile
export const getStaffById = async (id) => {
  try {
    const response = await axios.get(`${STAFF_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching staff profile with ID ${id}:`, error);
    throw error;
  }
};

// Update a staff profile
export const updateStaff = async (id, staffData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append file if it exists
    if (staffData.profileImage) {
      formData.append('profileImage', staffData.profileImage);
    }
    
    // Append text fields
    formData.append('name', staffData.name);
    formData.append('title', staffData.title);
    formData.append('qualifications', staffData.qualifications);
    formData.append('about', staffData.about);
    
    // Convert arrays to JSON strings before appending
    formData.append('achievements', JSON.stringify(staffData.achievements || []));
    formData.append('history', JSON.stringify(staffData.history || []));
    formData.append('timeline', JSON.stringify(staffData.timeline || []));
    
    const response = await axios.put(`${STAFF_ENDPOINT}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating staff profile with ID ${id}:`, error);
    throw error;
  }
};

// Delete a staff profile
export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${STAFF_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting staff profile with ID ${id}:`, error);
    throw error;
  }
};