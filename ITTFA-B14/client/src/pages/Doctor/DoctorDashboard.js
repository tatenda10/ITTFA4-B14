import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { NavLink } from 'react-router-dom';

function DoctorDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="ml-[20%] flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">
        Hey {user?.username}, Welcome to your Dashboard!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NavLink
          to="/doctor/appointments"
          className="flex items-center justify-center w-64 h-64 bg-indigo-600 text-white text-2xl font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Appointments
        </NavLink>
        <NavLink
          to="/doctor/patients"
          className="flex items-center justify-center w-64 h-64 bg-green-600 text-white text-2xl font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          Patients
        </NavLink>
        <NavLink
          to="/doctor/prescriptions"
          className="flex items-center justify-center w-64 h-64 bg-blue-600 text-white text-2xl font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Prescriptions
        </NavLink>
      </div>
    </div>
  );
}

export default DoctorDashboard;
