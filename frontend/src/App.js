// // // import React from 'react';
// // // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // // import Header from './components/Header';
// // // import Footer from './components/Footer';
// // // import Home from './pages/Home';
// // // import Gallery from './pages/Gallery';
// // // import CollegeEvents from './pages/CollegeEvents';

// // // import Videography from './pages/Videography';
// // // import Research from './pages/Research';
// // // import SocialAct from './pages/SocialActivities';
// // // import './styles.css'

// // // function App() {
// // //   return (
// // //     <Router>
// // //       <div className="flex flex-col min-h-screen bg-gray-50">
// // //         <Header />
// // //         <main className="flex-grow">
// // //           <Routes>
// // //             <Route path="/" element={<Home />} />
// // //             <Route path="/gallery" element={<Gallery />} />
// // //             <Route path="/events" element={<CollegeEvents />} />
// // //             <Route path="/social" element={<SocialAct/>} />
// // //             <Route path="/videos" element={<Videography />} />
// // //             <Route path="/research" element={<Research />} />
// // //           </Routes>
// // //         </main>
// // //         <Footer />
// // //       </div>
// // //     </Router>
// // //   );
// // // }

// // // export default App;



// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import Header from './components/Header';
// // import Footer from './components/Footer';
// // import Home from './pages/Home';
// // import Gallery from './pages/Gallery';
// // import CollegeEvents from './pages/CollegeEvents';
// // import Videography from './pages/Videography';
// // import Research from './pages/Research';
// // import SocialAct from './pages/SocialActivities';
// // import Login from './pages/Login';
// // import { AuthProvider } from './context/AuthContext';

// // import './styles.css';

// // function App() {
// //   return (
// //     <AuthProvider> {/* Wrap everything inside AuthProvider */}
// //       <Router>
// //         <div className="flex flex-col min-h-screen bg-gray-50">
// //           <Header />
// //           <main className="flex-grow">
// //             <Routes>
// //               <Route path="/" element={<Home />} />
// //               <Route path="/gallery" element={<Gallery />} />
// //               <Route path="/events" element={<CollegeEvents />} />
// //               <Route path="/social" element={<SocialAct />} />
// //               <Route path="/videos" element={<Videography />} />
// //               <Route path="/research" element={<Research />} />
// //               <Route path="/login" element={<Login />} />
// //             </Routes>
// //           </main>
// //           <Footer />
// //         </div>
// //       </Router>
// //     </AuthProvider>
// //   );
// // }

// // export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Gallery from './pages/Gallery';
// import CollegeEvents from './pages/CollegeEvents';
// import Videography from './pages/Videography';
// import Research from './pages/Research';
// import SocialAct from './pages/SocialActivities';
// import Login from './pages/Login';
// import AdminLayout from './components/admin/AdminLayout';
// import StaffList from './components/admin/StaffList';
// import StaffForm from './components/StaffForm';
// import { AuthProvider } from './context/AuthContext';

// import './styles.css';

// function App() {
//   return (
//     <AuthProvider> {/* Wrap everything inside AuthProvider */}
//       <Router>
//         <div className="flex flex-col min-h-screen bg-gray-50">
//           <Header />
//           <main className="flex-grow">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/gallery" element={<Gallery />} />
//               <Route path="/events" element={<CollegeEvents />} />
//               <Route path="/social" element={<SocialAct />} />
//               <Route path="/videos" element={<Videography />} />
//               <Route path="/research" element={<Research />} />
//               <Route path="/login" element={<Login />} />
              
//               {/* Admin Routes */}
//               <Route path="/admin" element={<AdminLayout />}>
//                 <Route path="staff" element={<StaffList />} />
//                 <Route path="staff/new" element={<StaffForm />} />
//                 <Route path="staff/edit/:id" element={<StaffForm />} />
//               </Route>
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;




















import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CollegeEvents from './pages/CollegeEvents';
import Videography from './pages/Videography';
import Research from './pages/Research';
import SocialAct from './pages/SocialActivities';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import StaffList from './components/admin/StaffList';
import StaffForm from './components/StaffForm';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

import './styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow pt-1"> {/* Added padding-top for fixed header */}
            <Routes>
              {/* Public Routes - Accessible to everyone */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/events" element={<CollegeEvents />} />
              <Route path="/social" element={<SocialAct />} />
              <Route path="/videos" element={<Videography />} />
              <Route path="/research" element={<Research />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }>
                <Route index element={<Navigate to="/admin/staff" />} />
                <Route path="staff" element={<StaffList />} />
                <Route path="staff/new" element={<StaffForm />} />
                <Route path="staff/edit/:id" element={<StaffForm />} />
              </Route>
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;