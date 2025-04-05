

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

// const Research = () => {
//   const { user } = useContext(AuthContext); // Access the user from AuthContext
//   const [title, setTitle] = useState('');
//   const [author, setAuthor] = useState('');
//   const [year, setYear] = useState('');
//   const [file, setFile] = useState(null);
//   const [researchPapers, setResearchPapers] = useState([]); // State to store fetched research papers

//   // Fetch research papers from backend
//   useEffect(() => {
//     const fetchResearchPapers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/research');      //change the URL loaclhost only
//         // Sort papers by year, descending
//         const sortedPapers = response.data.sort((a, b) => b.year - a.year);
//         setResearchPapers(sortedPapers); // Set the state with sorted data
//       } catch (error) {
//         console.error('Error fetching research papers:', error); // Log any errors
//       }
//     };

//     fetchResearchPapers();
//   }, []); // Empty array ensures it runs only once when the component mounts

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Form data to send to the backend
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('author', author);
//     formData.append('year', year);
//     formData.append('file', file);

//     try {
//       // Send POST request to the backend
//       const response = await axios.post('http://localhost:5000/api/research', formData, {         //change the URL loaclhost only
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Research uploaded successfully:', response.data);
//       // Clear form fields
//       setTitle('');
//       setAuthor('');
//       setYear('');
//       setFile(null);

//       // Optionally, fetch the updated list of papers after a successful upload
//       const updatedResponse = await axios.get('http://localhost:5000/api/research');           //change the URL loaclhost only
//       setResearchPapers(updatedResponse.data); // Update the state with new data
//     } catch (error) {
//       console.error('Error uploading research paper:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this paper?')) return;

//     try {
//       const response = await axios.delete(`http://localhost:5000/api/research/${id}`);              //change the URL loaclhost only
//       console.log('Deleted research paper:', response.data);
      
//       // Fetch the updated list of papers after deletion
//       const updatedResponse = await axios.get('http://localhost:5000/api/research');        //change the URL loaclhost only
//       setResearchPapers(updatedResponse.data); // Update the state with new data
//     } catch (error) {
//       console.error('Error deleting research paper:', error);
//     }
//   };

//   return (
//     <div className="bg-gray-100">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">📖 PhD Research & Publications</h1>
//         <motion.p
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="text-center text-gray-600 mb-10 text-lg"
//         >
//           A collection of research work and ongoing projects.
//         </motion.p>

//         {/* Admin File Upload Form */}
//         {user && user.role === 'admin' && (
//           <div className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4">Upload New Research Paper</h2>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-gray-700 font-semibold">Title:</label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="author" className="block text-gray-700 font-semibold">Author:</label>
//                 <input
//                   type="text"
//                   id="author"
//                   name="author"
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                   value={author}
//                   onChange={(e) => setAuthor(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="year" className="block text-gray-700 font-semibold">Year:</label>
//                 <input
//                   type="number"
//                   id="year"
//                   name="year"
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="file" className="block text-gray-700 font-semibold">Research Paper File:</label>
//                 <input
//                   type="file"
//                   id="file"
//                   name="file"
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                   onChange={handleFileChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="bg-green-600 text-white px-5 py-3 rounded-md">
//                 ➕ Upload Research
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Research Papers - Animated Cards */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
//           {researchPapers.map((paper, index) => (
//             <motion.div
//               key={paper._id}
//               className="bg-white shadow-lg rounded-xl p-7 border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer"
//               initial={{ opacity: 0, scale: 0 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: false }}
//               transition={{ duration: 0.4, delay: index * 0.1 }}
//               whileHover={{ scale: 1.08, boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)" }}
//             >
//               <h3 className="text-xl font-semibold text-gray-800">{paper.title}</h3>
//               <p className="text-gray-600 text-md mt-2">
//                 <span className="font-medium text-gray-700">Author:</span> {paper.author}
//               </p>
//               <p className="text-gray-600 text-md mt-1">
//                 <span className="font-medium text-gray-700">Year:</span> {paper.year}
//               </p>
//               <div className="mt-5">
//                 {paper.file ? (
//                   <a
//                     href={`http://localhost:5000/api/research/download/${paper.file}`} // Correct download URL with fileId
//                     download
//                     className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md text-md font-medium hover:bg-blue-700 transition"
//                   >
//                     📥 Download Paper
//                   </a>
//                 ) : (
//                   <p>No file available</p> // Display a message if no file is available
//                 )}
//               </div>

//               {/* Delete Button - Visible only to admin */}
//               {user && user.role === 'admin' && (
//                 <button
//                   className="mt-4 text-red-600 hover:text-red-800"
//                   onClick={() => handleDelete(paper._id)}
//                 >
//                   ❌ Delete
//                 </button>
//               )}
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Research;












import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import API_URL from "../config"; // Import API_URL from config

const Research = () => {
  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);
  const [researchPapers, setResearchPapers] = useState([]); // State to store fetched research papers

  // Fetch research papers from backend
  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const response = await axios.get(`${API_URL}/research`);
        // Sort papers by year, descending
        const sortedPapers = response.data.sort((a, b) => b.year - a.year);
        setResearchPapers(sortedPapers); // Set the state with sorted data
      } catch (error) {
        console.error('Error fetching research papers:', error); // Log any errors
      }
    };

    fetchResearchPapers();
  }, []); // Empty array ensures it runs only once when the component mounts

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form data to send to the backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year);
    formData.append('file', file);

    try {
      // Send POST request to the backend
      const response = await axios.post(`${API_URL}/research`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Research uploaded successfully:', response.data);
      // Clear form fields
      setTitle('');
      setAuthor('');
      setYear('');
      setFile(null);

      // Optionally, fetch the updated list of papers after a successful upload
      const updatedResponse = await axios.get(`${API_URL}/research`);
      setResearchPapers(updatedResponse.data); // Update the state with new data
    } catch (error) {
      console.error('Error uploading research paper:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;

    try {
      const response = await axios.delete(`${API_URL}/research/${id}`);
      console.log('Deleted research paper:', response.data);
      
      // Fetch the updated list of papers after deletion
      const updatedResponse = await axios.get(`${API_URL}/research`);
      setResearchPapers(updatedResponse.data); // Update the state with new data
    } catch (error) {
      console.error('Error deleting research paper:', error);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">📖 PhD Research & Publications</h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-600 mb-10 text-lg"
        >
          A collection of research work and ongoing projects.
        </motion.p>

        {/* Admin File Upload Form */}
        {user && user.role === 'admin' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upload New Research Paper</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-semibold">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="author" className="block text-gray-700 font-semibold">Author:</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="year" className="block text-gray-700 font-semibold">Year:</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block text-gray-700 font-semibold">Research Paper File:</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit" className="bg-green-600 text-white px-5 py-3 rounded-md">
                ➕ Upload Research
              </button>
            </form>
          </div>
        )}

        {/* Research Papers - Animated Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {researchPapers.map((paper, index) => (
            <motion.div
              key={paper._id}
              className="bg-white shadow-lg rounded-xl p-7 border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.08, boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)" }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{paper.title}</h3>
              <p className="text-gray-600 text-md mt-2">
                <span className="font-medium text-gray-700">Author:</span> {paper.author}
              </p>
              <p className="text-gray-600 text-md mt-1">
                <span className="font-medium text-gray-700">Year:</span> {paper.year}
              </p>
              <div className="mt-5">
                {paper.file ? (
                  <a
                    href={`${API_URL}/research/download/${paper.file}`} // Updated download URL with fileId
                    download
                    className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md text-md font-medium hover:bg-blue-700 transition"
                  >
                    📥 Download Paper
                  </a>
                ) : (
                  <p>No file available</p> // Display a message if no file is available
                )}
              </div>

              {/* Delete Button - Visible only to admin */}
              {user && user.role === 'admin' && (
                <button
                  className="mt-4 text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(paper._id)}
                >
                  ❌ Delete
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Research;