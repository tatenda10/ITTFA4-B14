import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUserFriends, FaProcedures, FaBoxes, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const SidebarDoctor = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the home or login page after logout
  };

  return (
    <div className="w-64 h-screen bg-indigo-700 text-white fixed top-0 left-0 flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6">Doctor Panel</h2>
      <nav className="flex flex-col space-y-2 flex-1">
        <NavLink
          to="/doctor"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaTachometerAlt className="mr-3" /> Dashboard
        </NavLink>
        <NavLink
          to="/doctor/patients"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaUserFriends className="mr-3" /> Patients
        </NavLink>
        <NavLink
          to="/doctor/prescriptions"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaProcedures className="mr-3" /> Prescriptions
        </NavLink>
        <NavLink
          to="/doctor/appointments"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaBoxes className="mr-3" /> Appointments
        </NavLink>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 p-3 rounded flex items-center"
      >
        <FaSignOutAlt className="mr-3" /> Logout
      </button>
    </div>
  );
};

export default SidebarDoctor;
