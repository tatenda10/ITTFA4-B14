import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUserFriends, FaProcedures, FaBoxes, FaFileAlt, FaCogs, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext'; // Adjust the path if necessary

const Sidebar = () => {
  const { logout } = useContext(AuthContext); // Get the logout function from the context
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Redirect to the login page after logout
  };

  return (
    <div className="w-64 h-screen bg-indigo-700 text-white fixed top-0 left-0 flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaTachometerAlt className="mr-3" /> Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaUserFriends className="mr-3" /> User Management
        </NavLink>
        <NavLink
          to="/admin/patients"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaProcedures className="mr-3" /> Patient Management
        </NavLink>
        <NavLink
          to="/admin/inventory"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaBoxes className="mr-3" /> Inventory Management
        </NavLink>
        <NavLink
          to="/admin/prescriptions"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaFileAlt className="mr-3" /> Prescriptions
        </NavLink>
       
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-3" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
