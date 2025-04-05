

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-800 text-white">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/admin/staff" 
                    className={`block p-3 rounded-md ${
                      isActive('/staff') 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Staff Management
                  </Link>
                </li>
                {/* Add more admin navigation items here as needed */}
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;