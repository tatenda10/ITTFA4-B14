import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';
import { AuthContext } from '../../contexts/AuthContext';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    medication_details: '',
    dosage: '',
    status: '',
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Fetch prescriptions issued by the logged-in doctor
      axios.post(`${BASE_URL}/api/doctors/prescriptions`, { username: user.username })
        .then((response) => setPrescriptions(response.data))
        .catch((error) => console.error("Error fetching prescriptions:", error));

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
      patient_id: '',
      medication_details: '',
      dosage: '',
      status: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include the username in the request body when creating a prescription
      await axios.post(`${BASE_URL}/api/prescriptions`, { ...formData, username: user.username });
      
      // Fetch the updated list of prescriptions after successfully creating a new one
      const response = await axios.post(`${BASE_URL}/api/doctors/prescriptions`, { username: user.username });
      setPrescriptions(response.data);
  
      closeModal(); // Close the modal after the operation
    } catch (error) {
      console.error("There was an error issuing the prescription!", error);
    }
  };
  
  
  return (
    <div className="ml-[20%] p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">My Prescriptions</h1>

      <div className="mb-8">
        <button onClick={openModal} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700">
          Issue New Prescription
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Issued Prescriptions</h2>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Patient Name</th>
              <th className="p-3">Medication</th>
              <th className="p-3">Dosage</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(prescription => (
              <tr key={prescription.prescription_id} className="border-b">
                <td className="p-3">{prescription.patient_first_name} {prescription.patient_last_name}</td>
                <td className="p-3">{prescription.medication_details}</td>
                <td className="p-3">{prescription.dosage}</td>
                <td className="p-3">{prescription.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Issuing New Prescription */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Issue New Prescription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <input
                type="text"
                name="medication_details"
                value={formData.medication_details}
                onChange={handleChange}
                placeholder="Medication Details"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="Dosage"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Status"
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
                  Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
