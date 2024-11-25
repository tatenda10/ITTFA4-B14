import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';
import { AuthContext } from '../../contexts/AuthContext';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '', // Updated to match the backend field name
    time: '',
    reason: '',
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.post(`${BASE_URL}/api/patients/appointments`, { username: user.username })
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));

    axios.get(`${BASE_URL}/api/doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, [user.username]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      doctor_id: '',
      appointment_date: '', // Updated to match the backend field name
      time: '',
      reason: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${BASE_URL}/api/patients/create-appointment`, { ...formData, username: user.username })
      .then((response) => {
        setAppointments([...appointments, response.data]);
        closeModal();
      })
      .catch((error) => {
        console.error("There was an error creating the appointment!", error);
      });
  };

  return (
    <div className="ml-[20%] p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">My Appointments</h1>

      <div className="mb-8">
        <button onClick={openModal} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700">
          Book New Appointment
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id} className="border-b">
                <td className="p-3">{appointment.appointment_date}</td> {/* Updated to use appointment_date */}
                <td className="p-3">{appointment.doctor_first_name} {appointment.doctor_last_name}</td>
                <td className="p-3">{appointment.reason}</td>
                <td className="p-3">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.first_name} {doctor.last_name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="appointment_date" // Updated to match the backend field name
                value={formData.appointment_date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for Appointment"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <div className="flex justify-between">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="p-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                >
                  Book Appointment
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
