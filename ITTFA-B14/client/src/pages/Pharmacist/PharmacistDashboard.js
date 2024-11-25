import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBoxes, FaPrescriptionBottle } from 'react-icons/fa';

function PharmacistDashboard() {
  return (
    <div className="p-6 ml-[20%] bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Pharmacist Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        <NavLink
          to="/pharmacist/inventory"
          className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-indigo-600 hover:text-white transition duration-300"
        >
          <FaBoxes className="text-6xl mb-4" />
          <h2 className="text-xl font-semibold">Manage Inventory</h2>
        </NavLink>

        <NavLink
          to="/pharmacist/prescriptions"
          className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-indigo-600 hover:text-white transition duration-300"
        >
          <FaPrescriptionBottle className="text-6xl mb-4" />
          <h2 className="text-xl font-semibold">Manage Prescriptions</h2>
        </NavLink>
      </div>
    </div>
  );
}

export default PharmacistDashboard;
