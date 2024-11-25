import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[20%] p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-indigo-700 mb-8">Admin Dashboard</h1>

        {/* Management Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            onClick={() => navigate('/admin/users')} 
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-semibold text-indigo-600">User Management</h3>
            <p className="text-gray-600 mt-2">Manage Doctors, Pharmacists, and other users.</p>
          </div>
          <div 
            onClick={() => navigate('/admin/patients')} 
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-semibold text-indigo-600">Patient Management</h3>
            <p className="text-gray-600 mt-2">View and manage patient records.</p>
          </div>
          <div 
            onClick={() => navigate('/admin/inventory')} 
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-semibold text-indigo-600">Inventory Management</h3>
            <p className="text-gray-600 mt-2">Manage pharmacy inventory and orders.</p>
          </div>        
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
