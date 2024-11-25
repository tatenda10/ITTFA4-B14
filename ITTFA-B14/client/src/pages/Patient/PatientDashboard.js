import React from 'react';
import { useNavigate } from 'react-router-dom';

function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex ml-[20%] flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">
        Hey, Welcome to your Dashboard!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div
          className="bg-indigo-600 text-white p-8 rounded-lg shadow-lg flex flex-col justify-between items-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={() => navigate('/patient/appointments')}
        >
          <h2 className="text-3xl font-semibold mb-4">Appointments</h2>
          <p className="text-center">View your upcoming appointments and their details.</p>
        </div>

        <div
          className="bg-green-600 text-white p-8 rounded-lg shadow-lg flex flex-col justify-between items-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={() => navigate('/patient/prescriptions')}
        >
          <h2 className="text-3xl font-semibold mb-4">Prescriptions</h2>
          <p className="text-center">Check your current prescriptions and related information.</p>
        </div>

        <div
          className="bg-yellow-600 text-white p-8 rounded-lg shadow-lg flex flex-col justify-between items-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={() => navigate('/patient/medical-history')}
        >
          <h2 className="text-3xl font-semibold mb-4">Medical History</h2>
          <p className="text-center">Review your medical history records.</p>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
