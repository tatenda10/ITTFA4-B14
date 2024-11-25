import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    doctor_name: '',
    appointment_date: '',
    appointment_time: '',
    status: '',
  });
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);

  useEffect(() => {
    // Fetch appointments from the backend
    axios.get(`${BASE_URL}/api/appointments`)
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  const openEditModal = (appointment) => {
    setFormData({
      patient_name: appointment.patient_name,
      doctor_name: appointment.doctor_name,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
    });
    setCurrentAppointmentId(appointment.id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({
      patient_name: '',
      doctor_name: '',
      appointment_date: '',
      appointment_time: '',
      status: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`${BASE_URL}/api/appointments/${currentAppointmentId}`, formData)
      .then((response) => {
        setAppointments(appointments.map(appointment => appointment.id === currentAppointmentId ? response.data : appointment));
        closeEditModal();
      })
      .catch((error) => {
        console.error("There was an error updating the appointment!", error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Appointments</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointment List</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Patient Name</th>
              <th className="p-3">Doctor Name</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id} className="border-b">
                <td className="p-3">{appointment.patient_name}</td>
                <td className="p-3">{appointment.doctor_name}</td>
                <td className="p-3">{appointment.appointment_date}</td>
                <td className="p-3">{appointment.appointment_time}</td>
                <td className="p-3">{appointment.status}</td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => openEditModal(appointment)} className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing Appointment */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Appointment</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="Patient Name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                placeholder="Doctor Name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                placeholder="Appointment Date"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                placeholder="Appointment Time"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="flex justify-between">
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="p-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                >
                  Update Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
