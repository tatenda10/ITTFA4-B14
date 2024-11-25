import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';
import { AuthContext } from '../../contexts/AuthContext';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    appointment_date: '',
    reason: '',
    status: '',
    patient_id: '',
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Fetch appointments by the logged-in doctor
      axios.post(`${BASE_URL}/api/doctors/appointments`, { username: user.username })
        .then((response) => setAppointments(response.data))
        .catch((error) => console.error("Error fetching appointments:", error));

      // Fetch patients that belong to the logged-in doctor
      axios.post(`${BASE_URL}/api/doctors/patients`, { username: user.username })
        .then((response) => setPatients(response.data))
        .catch((error) => console.error("Error fetching patients:", error));
    }
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      appointment_date: '',
      reason: '',
      status: '',
      patient_id: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include the username in the request body when creating an appointment
    axios.post(`${BASE_URL}/api/appointments`, { ...formData, username: user.username })
      .then((response) => {
        fetchAppointments(); // Refetch the appointments list to update the table
        closeModal();
      })
      .catch((error) => {
        console.error("There was an error creating the appointment!", error);
      });
  };

  const fetchAppointments = () => {
    // Fetch appointments by the logged-in doctor
    axios.post(`${BASE_URL}/api/doctors/appointments`, { username: user.username })
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  return (
    <div className="ml-[20%] p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">My Appointments</h1>

      <div className="mb-8">
        <button onClick={openModal} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700">
          Create New Appointment
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Scheduled Appointments</h2>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Appointment Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Patient Name</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.appointment_id} className="border-b">
                <td className="p-3">{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td className="p-3">{appointment.reason}</td>
                <td className="p-3">{appointment.status}</td>
                <td className="p-3">{appointment.patient_first_name} {appointment.patient_last_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating New Appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="datetime-local"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason"
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
                <option value="">Select Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
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
                  Create Appointment
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
