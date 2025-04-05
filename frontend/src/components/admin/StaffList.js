

  // import React, { useState, useEffect } from 'react';
  // import { Link } from 'react-router-dom';
  // import { getAllStaff, deleteStaff } from '../../services/staffService';

  // const StaffList = () => {
  //   const [staff, setStaff] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState('');

  //   // Fetch all staff on component mount
  //   useEffect(() => {
  //     const fetchStaff = async () => {
  //       try {
  //         setLoading(true);
  //         const data = await getAllStaff();
  //         setStaff(data);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error('Error fetching staff:', error);
  //         setError('Failed to load staff list. Please try again.');
  //         setLoading(false);
  //       }
  //     };

  //     fetchStaff();
  //   }, []);

  //   // Handle staff deletion
  //   const handleDelete = async (id, name) => {
  //     if (window.confirm(`Are you sure you want to delete ${name}'s profile?`)) {
  //       try {
  //         await deleteStaff(id);
  //         // Update the state by removing the deleted staff
  //         setStaff(staff.filter(item => item._id !== id));
  //       } catch (error) {
  //         console.error('Error deleting staff:', error);
  //         setError('Failed to delete staff profile');
  //       }
  //     }
  //   };

  //   if (loading) {
  //     return <div className="text-center py-10">Loading staff profiles...</div>;
  //   }

  //   return (
  //     <div className="container mx-auto p-6">
  //       <div className="flex justify-between items-center mb-6">
  //         <h1 className="text-2xl font-bold">Staff Management</h1>
  //         <Link 
  //           to="/admin/staff/new" 
  //           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
  //         >
  //           Add New Staff
  //         </Link>
  //       </div>

  //       {error && (
  //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
  //           {error}
  //         </div>
  //       )}

  //       {staff.length === 0 && !loading ? (
  //         <div className="text-center py-8 bg-gray-50 rounded-md">
  //           <p className="text-gray-500">No staff profiles found. Create your first staff profile!</p>
  //         </div>
  //       ) : (
  //         <div className="bg-white rounded-lg shadow overflow-hidden">
  //           <table className="min-w-full divide-y divide-gray-200">
  //             <thead className="bg-gray-50">
  //               <tr>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Profile
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Details
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Timeline Entries
  //                 </th>
  //                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Actions
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody className="bg-white divide-y divide-gray-200">
  //               {staff.map((staffMember) => (
  //                 <tr key={staffMember._id}>
  //                   <td className="px-6 py-4 whitespace-nowrap">
  //                     <div className="flex items-center">
  //                       <div className="flex-shrink-0 h-10 w-10">
  //                         {staffMember.profileImage ? (
  //                           <img 
  //                             className="h-10 w-10 rounded-full object-cover" 
  //                             src={`http://localhost:5000${staffMember.profileImage}`} 
  //                             alt={staffMember.name} 
  //                           />
  //                         ) : (
  //                           <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
  //                             <span className="text-gray-600">{staffMember.name.charAt(0)}</span>
  //                           </div>
  //                         )}
  //                       </div>
  //                       <div className="ml-4">
  //                         <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
  //                         <div className="text-sm text-gray-500">{staffMember.title}</div>
  //                       </div>
  //                     </div>
  //                   </td>
  //                   <td className="px-6 py-4">
  //                     <div className="text-sm text-gray-900">{staffMember.qualifications}</div>
  //                     <div className="text-sm text-gray-500 truncate max-w-xs">
  //                       {staffMember.about.substring(0, 100)}...
  //                     </div>
  //                   </td>
  //                   <td className="px-6 py-4">
  //                     <div className="text-sm text-gray-900">
  //                       {staffMember.timeline ? staffMember.timeline.length : 0} entries
  //                     </div>
  //                   </td>
  //                   <td className="px-6 py-4 text-right text-sm font-medium">
  //                     <Link 
  //                       to={`/admin/staff/edit/${staffMember._id}`} 
  //                       className="text-blue-600 hover:text-blue-900 mr-4"
  //                     >
  //                       Edit
  //                     </Link>
  //                     <button
  //                       onClick={() => handleDelete(staffMember._id, staffMember.name)}
  //                       className="text-red-600 hover:text-red-900"
  //                     >
  //                       Delete
  //                     </button>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default StaffList;










  import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStaff, deleteStaff } from '../../services/staffService';
import API_URL from '../../config';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all staff on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await getAllStaff();
        setStaff(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setError('Failed to load staff list. Please try again.');
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Handle staff deletion
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s profile?`)) {
      try {
        await deleteStaff(id);
        // Update the state by removing the deleted staff
        setStaff(staff.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff profile');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading staff profiles...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Link 
          to="/admin/staff/new" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Staff
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {staff.length === 0 && !loading ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No staff profiles found. Create your first staff profile!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline Entries
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((staffMember) => (
                <tr key={staffMember._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {staffMember.profileImage ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={`${API_URL}${staffMember.profileImage}`} 
                            alt={staffMember.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600">{staffMember.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                        <div className="text-sm text-gray-500">{staffMember.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{staffMember.qualifications}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {staffMember.about.substring(0, 100)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {staffMember.timeline ? staffMember.timeline.length : 0} entries
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link 
                      to={`/admin/staff/edit/${staffMember._id}`} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(staffMember._id, staffMember.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;