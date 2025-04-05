
// import React, { useState, useContext, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/videos"; // Update when deployed

// const Videography = () => {
//   const { user } = useContext(AuthContext);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const videoRef = useRef(null);

//   // ✅ Fetch videos from backend
//   useEffect(() => {
//     axios.get(API_URL)
//       .then(res => {
//         // Assuming the backend doesn't send the videos sorted, we reverse them here to show the most recent first.
//         setVideos(res.data.reverse());
//       })
//       .catch(err => console.error("Error fetching videos:", err));
//   }, []);

//   const [newVideo, setNewVideo] = useState({
//     title: "", desc: "", preview: "", src: "", start: "00:00", end: "00:00", isYoutube: false
//   });

//   // Convert MM:SS to seconds
//   const timeToSeconds = (time) => {
//     if (!time.includes(":")) return 0; // Prevent invalid values
//     const [minutes, seconds] = time.split(":").map(Number);
//     return (minutes * 60) + (seconds || 0);
//   };

//   // Extract YouTube video ID from various YouTube URL formats and add start/end times
//   const getYoutubeEmbedUrl = (url, startSeconds, endSeconds) => {
//     // Handle different YouTube URL formats
//     let videoId = '';
    
//     if (url.includes('youtube.com/watch?v=')) {
//       videoId = url.split('v=')[1];
//       // Handle additional parameters
//       const ampersandPosition = videoId.indexOf('&');
//       if (ampersandPosition !== -1) {
//         videoId = videoId.substring(0, ampersandPosition);
//       }
//     } else if (url.includes('youtu.be/')) {
//       videoId = url.split('youtu.be/')[1];
//       // Handle additional parameters
//       const questionMarkPosition = videoId.indexOf('?');
//       if (questionMarkPosition !== -1) {
//         videoId = videoId.substring(0, questionMarkPosition);
//       }
//     } else if (url.includes('youtube.com/embed/')) {
//       videoId = url.split('embed/')[1];
//       // Handle additional parameters
//       const questionMarkPosition = videoId.indexOf('?');
//       if (questionMarkPosition !== -1) {
//         videoId = videoId.substring(0, questionMarkPosition);
//       }
//     }
    
//     // Build the embed URL with start and end parameters
//     let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    
//     // Add start time if valid
//     if (startSeconds && startSeconds > 0) {
//       embedUrl += `&start=${startSeconds}`;
//     }
    
//     // Add end time if valid
//     if (endSeconds && endSeconds > startSeconds) {
//       embedUrl += `&end=${endSeconds}`;
//     }
    
//     return embedUrl;
//   };

//   // ✅ Add Video to Backend
//   const addVideo = () => {
//     const startSeconds = timeToSeconds(newVideo.start);
//     const endSeconds = timeToSeconds(newVideo.end);

//     if (isNaN(startSeconds) || isNaN(endSeconds)) {
//       alert("Invalid start or end time. Please enter in MM:SS format.");
//       return;
//     }

//     axios.post(API_URL, { ...newVideo, start: startSeconds, end: endSeconds })
//       .then(res => {
//         // Prepend the new video to the top of the list
//         setVideos(prevVideos => [res.data, ...prevVideos]); 
//         // Reset the form
//         setNewVideo({
//           title: "", desc: "", preview: "", src: "", start: "00:00", end: "00:00", isYoutube: false
//         });
//       })
//       .catch(err => console.error("Error adding video:", err));
//   };

//   // ✅ Fix: Delete Only the Specific Video
//   const deleteVideo = (id) => {
//     axios.delete(`${API_URL}/${id}`)
//       .then(() => {
//         setVideos(videos.filter(video => video._id !== id));
//       })
//       .catch(err => console.error("Error deleting video:", err));
//   };

//   // ✅ Ensure MP4 videos play from the correct start time
//   useEffect(() => {
//     if (selectedVideo && !selectedVideo.isYoutube && videoRef.current) {
//       const videoElement = videoRef.current;
//       const startTime = Number(selectedVideo.start);

//       if (!isNaN(startTime) && startTime >= 0) {
//         videoElement.currentTime = startTime;
//         videoElement.play();
//       }

//       const stopVideo = () => {
//         const endTime = Number(selectedVideo.end);
//         if (!isNaN(endTime) && videoElement.currentTime >= endTime) {
//           videoElement.pause();
//         }
//       };

//       videoElement.addEventListener("timeupdate", stopVideo);
//       return () => videoElement.removeEventListener("timeupdate", stopVideo);
//     }
//   }, [selectedVideo]);

//   return (
//     <div className="container mx-auto p-6 bg-gray-100">
//       <motion.h1 
//         whileInView={{ opacity: 1, y: 0 }} 
//         initial={{ opacity: 0, y: 20 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="text-4xl font-bold text-center my-6 text-gray-800"
//       >
//         🎬 Videography
//       </motion.h1>

//       <motion.p
//         whileInView={{ opacity: 1, y: 0 }}
//         initial={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//         viewport={{ once: true }}
//         className="text-center text-gray-600 mb-10 text-lg"
//       >
//         Explore event highlights and important college moments.
//       </motion.p>

//       {/* ✅ Admin Upload Section */}
//       {user && (
//         <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Upload New Video</h2>
//           <div className="flex flex-col space-y-2">
//             <input type="text" placeholder="Video Title" className="p-2 border rounded-lg" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} />
//             <input type="text" placeholder="Video Description" className="p-2 border rounded-lg" value={newVideo.desc} onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })} />
//             <input type="text" placeholder="Preview Image URL" className="p-2 border rounded-lg" value={newVideo.preview} onChange={(e) => setNewVideo({ ...newVideo, preview: e.target.value })} />
//             <input type="text" placeholder="YouTube Video URL (or MP4 link)" className="p-2 border rounded-lg"
//               value={newVideo.src} onChange={(e) => setNewVideo({ ...newVideo, src: e.target.value, isYoutube: e.target.value.includes("youtube.com") || e.target.value.includes("youtu.be") })} />

//             <div className="flex space-x-2">
//               <input type="text" placeholder="Start (MM:SS)" className="p-2 border rounded-lg w-1/2"
//                 value={newVideo.start} onChange={(e) => setNewVideo({ ...newVideo, start: e.target.value })} />
//               <input type="text" placeholder="End (MM:SS)" className="p-2 border rounded-lg w-1/2"
//                 value={newVideo.end} onChange={(e) => setNewVideo({ ...newVideo, end: e.target.value })} />
//             </div>

//             <button onClick={addVideo} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Add Video</button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Video Gallery */}
//       <motion.div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10">
//         {videos.map((video, index) => (
//           <motion.div 
//             key={video._id} 
//             className="relative group rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 cursor-pointer transition duration-300 hover:shadow-xl"
//             whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
//             whileInView={{ opacity: 1, y: 0 }}
//             initial={{ opacity: 0, y: 50 }}
//             transition={{ delay: (index % 10) * 0.05, duration: 0.4, ease: "easeOut" }}
//             viewport={{ once: false, amount: 0.3 }}
//             onClick={() => setSelectedVideo(video)}
//           >
//             <img 
//               className="w-full h-52 object-cover rounded-t-lg group-hover:brightness-75 transition"
//               src={video.preview}
//               alt={video.title}
//             />
//             <div className="p-4">
//               <h2 className="text-lg font-semibold text-gray-900">{video.title}</h2>
//               <p className="text-sm text-gray-600">{video.desc}</p>
//             </div>

//             {/* ✅ Delete Button */}
//             {user && (
//               <button 
//                 className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
//                 onClick={(e) => { e.stopPropagation(); deleteVideo(video._id); }}
//               >
//                 Delete
//               </button>
//             )}
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* ✅ Full-Screen Video Modal */}
//       {selectedVideo && (
//         <motion.div 
//           className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           onClick={() => setSelectedVideo(null)}
//         >
//           <motion.div 
//             className="relative w-full max-w-4xl bg-black p-4 rounded-lg shadow-lg"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.3 }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 z-10" onClick={() => setSelectedVideo(null)}>✕</button>
            
//             {/* Conditional Rendering for YouTube and MP4 */}
//             {selectedVideo.isYoutube ? (
//               <div className="relative w-full pt-[56.25%]">
//                 <iframe
//                   className="absolute top-0 left-0 w-full h-full"
//                   src={getYoutubeEmbedUrl(selectedVideo.src, selectedVideo.start, selectedVideo.end)}
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   title="Video"
//                 ></iframe>
//               </div>
//             ) : (
//               <video ref={videoRef} className="w-full h-auto rounded-md" controls autoPlay>
//                 <source src={selectedVideo.src} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Videography;





















import React, { useState, useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import API_URL from "../config";

const Videography = () => {
  const { user } = useContext(AuthContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const videoRef = useRef(null);

  // ✅ Fetch videos from backend
  useEffect(() => {
    axios.get(`${API_URL}/videos`)
      .then(res => {
        // Assuming the backend doesn't send the videos sorted, we reverse them here to show the most recent first.
        setVideos(res.data.reverse());
      })
      .catch(err => console.error("Error fetching videos:", err));
  }, []);

  const [newVideo, setNewVideo] = useState({
    title: "", desc: "", preview: "", src: "", start: "00:00", end: "00:00", isYoutube: false
  });

  // Convert MM:SS to seconds
  const timeToSeconds = (time) => {
    if (!time.includes(":")) return 0; // Prevent invalid values
    const [minutes, seconds] = time.split(":").map(Number);
    return (minutes * 60) + (seconds || 0);
  };

  // Extract YouTube video ID from various YouTube URL formats and add start/end times
  const getYoutubeEmbedUrl = (url, startSeconds, endSeconds) => {
    // Handle different YouTube URL formats
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1];
      // Handle additional parameters
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      // Handle additional parameters
      const questionMarkPosition = videoId.indexOf('?');
      if (questionMarkPosition !== -1) {
        videoId = videoId.substring(0, questionMarkPosition);
      }
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1];
      // Handle additional parameters
      const questionMarkPosition = videoId.indexOf('?');
      if (questionMarkPosition !== -1) {
        videoId = videoId.substring(0, questionMarkPosition);
      }
    }
    
    // Build the embed URL with start and end parameters
    let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    
    // Add start time if valid
    if (startSeconds && startSeconds > 0) {
      embedUrl += `&start=${startSeconds}`;
    }
    
    // Add end time if valid
    if (endSeconds && endSeconds > startSeconds) {
      embedUrl += `&end=${endSeconds}`;
    }
    
    return embedUrl;
  };

  // ✅ Add Video to Backend
  const addVideo = () => {
    const startSeconds = timeToSeconds(newVideo.start);
    const endSeconds = timeToSeconds(newVideo.end);

    if (isNaN(startSeconds) || isNaN(endSeconds)) {
      alert("Invalid start or end time. Please enter in MM:SS format.");
      return;
    }

    axios.post(`${API_URL}/videos`, { ...newVideo, start: startSeconds, end: endSeconds })
      .then(res => {
        // Prepend the new video to the top of the list
        setVideos(prevVideos => [res.data, ...prevVideos]); 
        // Reset the form
        setNewVideo({
          title: "", desc: "", preview: "", src: "", start: "00:00", end: "00:00", isYoutube: false
        });
      })
      .catch(err => console.error("Error adding video:", err));
  };

  // ✅ Fix: Delete Only the Specific Video
  const deleteVideo = (id) => {
    axios.delete(`${API_URL}/videos/${id}`)
      .then(() => {
        setVideos(videos.filter(video => video._id !== id));
      })
      .catch(err => console.error("Error deleting video:", err));
  };

  // ✅ Ensure MP4 videos play from the correct start time
  useEffect(() => {
    if (selectedVideo && !selectedVideo.isYoutube && videoRef.current) {
      const videoElement = videoRef.current;
      const startTime = Number(selectedVideo.start);

      if (!isNaN(startTime) && startTime >= 0) {
        videoElement.currentTime = startTime;
        videoElement.play();
      }

      const stopVideo = () => {
        const endTime = Number(selectedVideo.end);
        if (!isNaN(endTime) && videoElement.currentTime >= endTime) {
          videoElement.pause();
        }
      };

      videoElement.addEventListener("timeupdate", stopVideo);
      return () => videoElement.removeEventListener("timeupdate", stopVideo);
    }
  }, [selectedVideo]);

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <motion.h1 
        whileInView={{ opacity: 1, y: 0 }} 
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold text-center my-6 text-gray-800"
      >
        🎬 Videography
      </motion.h1>

      <motion.p
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-center text-gray-600 mb-10 text-lg"
      >
        Explore event highlights and important college moments.
      </motion.p>

      {/* ✅ Admin Upload Section */}
      {user && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Upload New Video</h2>
          <div className="flex flex-col space-y-2">
            <input type="text" placeholder="Video Title" className="p-2 border rounded-lg" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} />
            <input type="text" placeholder="Video Description" className="p-2 border rounded-lg" value={newVideo.desc} onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })} />
            <input type="text" placeholder="Preview Image URL" className="p-2 border rounded-lg" value={newVideo.preview} onChange={(e) => setNewVideo({ ...newVideo, preview: e.target.value })} />
            <input type="text" placeholder="YouTube Video URL (or MP4 link)" className="p-2 border rounded-lg"
              value={newVideo.src} onChange={(e) => setNewVideo({ ...newVideo, src: e.target.value, isYoutube: e.target.value.includes("youtube.com") || e.target.value.includes("youtu.be") })} />

            <div className="flex space-x-2">
              <input type="text" placeholder="Start (MM:SS)" className="p-2 border rounded-lg w-1/2"
                value={newVideo.start} onChange={(e) => setNewVideo({ ...newVideo, start: e.target.value })} />
              <input type="text" placeholder="End (MM:SS)" className="p-2 border rounded-lg w-1/2"
                value={newVideo.end} onChange={(e) => setNewVideo({ ...newVideo, end: e.target.value })} />
            </div>

            <button onClick={addVideo} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Add Video</button>
          </div>
        </div>
      )}

      {/* ✅ Video Gallery */}
      <motion.div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10">
        {videos.map((video, index) => (
          <motion.div 
            key={video._id} 
            className="relative group rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 cursor-pointer transition duration-300 hover:shadow-xl"
            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ delay: (index % 10) * 0.05, duration: 0.4, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            onClick={() => setSelectedVideo(video)}
          >
            <img 
              className="w-full h-52 object-cover rounded-t-lg group-hover:brightness-75 transition"
              src={video.preview}
              alt={video.title}
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{video.title}</h2>
              <p className="text-sm text-gray-600">{video.desc}</p>
            </div>

            {/* ✅ Delete Button */}
            {user && (
              <button 
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                onClick={(e) => { e.stopPropagation(); deleteVideo(video._id); }}
              >
                Delete
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ Full-Screen Video Modal */}
      {selectedVideo && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div 
            className="relative w-full max-w-4xl bg-black p-4 rounded-lg shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 z-10" onClick={() => setSelectedVideo(null)}>✕</button>
            
            {/* Conditional Rendering for YouTube and MP4 */}
            {selectedVideo.isYoutube ? (
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={getYoutubeEmbedUrl(selectedVideo.src, selectedVideo.start, selectedVideo.end)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video"
                ></iframe>
              </div>
            ) : (
              <video ref={videoRef} className="w-full h-auto rounded-md" controls autoPlay>
                <source src={selectedVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Videography;