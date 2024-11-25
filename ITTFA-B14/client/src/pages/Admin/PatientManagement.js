import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';

function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    email: '',
    address: '',
    medical_history: '',
    username: '', // New field
    password: '', // New field
  });
  const [currentPatientId, setCurrentPatientId] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors from the backend
  useEffect(() => {
    axios.get(`${BASE_URL}/api/doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  // Fetch patients from the backend
  useEffect(() => {
    axios.get(`${BASE_URL}/api/patients`)
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  const handleAssignDoctor = (patientId) => {
    if (!selectedDoctor) {
      alert("Please select a doctor to assign.");
      return;
    }

    axios.put(`${BASE_URL}/api/patients/${patientId}/assign-doctor`, { doctor_id: selectedDoctor })
      .then(() => {
        setPatients(patients.map(patient =>
          patient.patient_id === patientId ? { ...patient, doctor_id: selectedDoctor } : patient
        ));
        alert("Doctor assigned successfully");
      })
      .catch((error) => {
        console.error("There was an error assigning the doctor!", error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      first_name: '',
      last_name: '',
      dob: '',
      gender: '',
      phone_number: '',
      email: '',
      address: '',
      medical_history: '',
      username: '', // Reset new fields
      password: '', // Reset new fields
    });
  };

  const openEditModal = (patient) => {
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      dob: patient.dob,
      gender: patient.gender,
      phone_number: patient.phone_number,
      email: patient.email,
      address: patient.address,
      medical_history: patient.medical_history,
      username: patient.username, // If editable
      // Note: Password is typically not fetched for security reasons
    });
    setCurrentPatientId(patient.patient_id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({
      first_name: '',
      last_name: '',
      dob: '',
      gender: '',
      phone_number: '',
      email: '',
      address: '',
      medical_history: '',
      username: '', // Reset new fields
      password: '', // Reset new fields if included
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
      const response = await axios.post(`${BASE_URL}/api/patients`, formData);
      
      // Assuming the backend returns the created patient object
      setPatients([...patients, response.data]);
      closeModal();
      alert("Patient created successfully");
    } catch (error) {
      console.error("There was an error creating the patient!", error);
      alert("Failed to create patient");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/api/patients/${currentPatientId}`, formData);
      
      // Assuming the backend returns the updated patient object
      setPatients(patients.map(patient => 
        patient.patient_id === currentPatientId ? response.data : patient
      ));
      closeEditModal();
      alert("Patient updated successfully");
    } catch (error) {
      console.error("There was an error updating the patient!", error);
      alert("Failed to update patient");
    }
  };

  return (
    <div className="ml-[10%] bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Patient Management</h1>
      <div className="mb-8">
        <button onClick={openModal} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700">
          Add Patient
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patients</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 min-w-[150px]">First Name</th>
              <th className="p-3 min-w-[150px]">Last Name</th>
              <th className="p-3 min-w-[150px]">Date of Birth</th>
              <th className="p-3 min-w-[100px]">Gender</th>
              <th className="p-3 min-w-[150px]">Phone Number</th>
              <th className="p-3 min-w-[200px]">Email</th>
              <th className="p-3 min-w-[250px]">Address</th>
              <th className="p-3 min-w-[150px]">Username</th>
              <th className="p-3 min-w-[200px]">Doctor Name</th>
              <th className="p-3 min-w-[250px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patient_id} className="border-b">
                <td className="p-3">{patient.first_name}</td>
                <td className="p-3">{patient.last_name}</td>
                <td className="p-3">{patient.dob}</td>
                <td className="p-3">{patient.gender}</td>
                <td className="p-3">{patient.phone_number}</td>
                <td className="p-3">{patient.email}</td>
                <td className="p-3">{patient.address}</td>
                <td className="p-3">{patient.username}</td>
                <td className="p-3">
                  {patient.doctor_first_name} {patient.doctor_last_name}
                </td>
                <td className="p-3 flex space-x-2 items-center">
                  <button
                    onClick={() => openEditModal(patient)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <select
                    className="p-2 border rounded"
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    value={selectedDoctor || ''}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        {doctor.first_name} {doctor.last_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAssignDoctor(patient.patient_id)}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Assign Doctor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                placeholder="Medical History"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {/* New Fields */}
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
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
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Patient */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Patient</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                placeholder="Medical History"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
              {/* Optionally include username and password fields in edit modal */}
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
              />
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
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientManagement;
