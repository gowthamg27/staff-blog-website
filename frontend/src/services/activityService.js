

// // import axios from "axios";

// // // Use environment variable for API URL, default to local backend URL if not set
// // const API_URL ="http://localhost:5000/api/activities"; 

// // // Fetch all activities
// // export const getActivities = async () => {
// //   try {
// //     const response = await axios.get(API_URL);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching activities:", error);
// //     throw new Error("Unable to fetch activities. Please try again later.");
// //   }
// // };

// // // Fetch a single activity by ID
// // export const getActivity = async (id) => {
// //   try {
// //     const response = await axios.get(`${API_URL}/${id}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching activity:", error);
// //     throw new Error("Unable to fetch activity details. Please try again later.");
// //   }
// // };

// // // Create a new activity with FormData support for file upload
// // export const createActivity = async (formData) => {
// //   try {
// //     const response = await axios.post(API_URL, formData, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data', // Important for file uploads
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error creating activity:", error);
// //     throw new Error("Unable to create activity. Please try again later.");
// //   }
// // };

// // // Update an existing activity by ID with FormData support
// // export const updateActivity = async (id, formData) => {
// //   try {
// //     const response = await axios.put(`${API_URL}/${id}`, formData, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data', // Important for file uploads
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error updating activity:", error);
// //     throw new Error("Unable to update activity. Please try again later.");
// //   }
// // };

// // // Delete an activity by ID
// // export const deleteActivity = async (id) => {
// //   try {
// //     const response = await axios.delete(`${API_URL}/${id}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error deleting activity:", error);
// //     throw new Error("Unable to delete activity. Please try again later.");
// //   }
// // };



// import axios from "axios";
// import API_URL from "../config";

// // Use the imported API_URL from config.js, with a fallback in case it's undefined
// const ACTIVITIES_ENDPOINT = API_URL ; 

// // For debugging - remove after fixing
// console.log("API_URL from config:", API_URL);
// console.log("ACTIVITIES_ENDPOINT:", ACTIVITIES_ENDPOINT);

// // Fetch all activities
// export const getActivities = async () => {
//   try {
//     const response = await axios.get(ACTIVITIES_ENDPOINT);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching activities:", error);
//     throw new Error("Unable to fetch activities. Please try again later.");
//   }
// };

// // Fetch a single activity by ID
// export const getActivity = async (id) => {
//   try {
//     const response = await axios.get(`${ACTIVITIES_ENDPOINT}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching activity:", error);
//     throw new Error("Unable to fetch activity details. Please try again later.");
//   }
// };

// // Create a new activity with FormData support for file upload
// export const createActivity = async (formData) => {
//   try {
//     const response = await axios.post(ACTIVITIES_ENDPOINT, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // Important for file uploads
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating activity:", error);
//     throw new Error("Unable to create activity. Please try again later.");
//   }
// };

// // Update an existing activity by ID with FormData support
// export const updateActivity = async (id, formData) => {
//   try {
//     const response = await axios.put(`${ACTIVITIES_ENDPOINT}/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // Important for file uploads
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating activity:", error);
//     throw new Error("Unable to update activity. Please try again later.");
//   }
// };

// // Delete an activity by ID
// export const deleteActivity = async (id) => {
//   try {
//     const response = await axios.delete(`${ACTIVITIES_ENDPOINT}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting activity:", error);
//     throw new Error("Unable to delete activity. Please try again later.");
//   }
// };









import axios from "axios";
import API_URL from "../config";

// Use the imported API_URL from config.js
const ACTIVITIES_ENDPOINT = `${API_URL}/activities`; 

// Fetch all activities
export const getActivities = async () => {
  try {
    const response = await axios.get(ACTIVITIES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw new Error("Unable to fetch activities. Please try again later.");
  }
};

// Fetch a single activity by ID
export const getActivity = async (id) => {
  try {
    const response = await axios.get(`${ACTIVITIES_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw new Error("Unable to fetch activity details. Please try again later.");
  }
};

// Create a new activity with FormData support for file upload
export const createActivity = async (formData) => {
  try {
    const response = await axios.post(ACTIVITIES_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw new Error("Unable to create activity. Please try again later.");
  }
};

// Update an existing activity by ID with FormData support
export const updateActivity = async (id, formData) => {
  try {
    const response = await axios.put(`${ACTIVITIES_ENDPOINT}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating activity:", error);
    throw new Error("Unable to update activity. Please try again later.");
  }
};

// Delete an activity by ID
export const deleteActivity = async (id) => {
  try {
    const response = await axios.delete(`${ACTIVITIES_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw new Error("Unable to delete activity. Please try again later.");
  }
};