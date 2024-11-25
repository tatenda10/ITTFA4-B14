import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUserFriends, FaProcedures, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const SidebarPharmacist = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the home page or login page after logout
  };

  return (
    <div className="w-64 h-screen bg-indigo-700 text-white fixed top-0 left-0 flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6">Pharmacist Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/pharmacist"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaTachometerAlt className="mr-3" /> Dashboard
        </NavLink>
        <NavLink
          to="/pharmacist/prescriptions"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaUserFriends className="mr-3" /> Prescriptions
        </NavLink>
        <NavLink
          to="/pharmacist/inventory"
          className="hover:bg-indigo-600 p-3 rounded flex items-center border-b border-indigo-600"
          activeClassName="bg-indigo-600"
        >
          <FaProcedures className="mr-3" /> Inventory
        </NavLink>
        <button
          onClick={handleLogout}
          className="hover:bg-red-600 p-3 rounded flex items-center border-b border-indigo-600 mt-auto"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default SidebarPharmacist;
