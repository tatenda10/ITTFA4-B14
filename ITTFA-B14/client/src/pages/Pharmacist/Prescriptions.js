// src/components/Prescriptions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    date_issued: '',
    medication_details: '',
    dosage: '',
    patient_id: '',
    doctor_id: '',
    pharmacist_id: '',
    status: '',
  });
  const [editingPrescription, setEditingPrescription] = useState(null); // For editing prescriptions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data for prescriptions, doctors, and patients
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prescriptionRes, doctorRes, patientRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/prescriptions`),
          axios.get(`${BASE_URL}/api/doctors`),
          axios.get(`${BASE_URL}/api/patients`),
        ]);
        setPrescriptions(prescriptionRes.data);
        setDoctors(doctorRes.data);
        setPatients(patientRes.data);
        setError(null);
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingPrescription) {
      setEditingPrescription({ ...editingPrescription, [name]: value });
    } else {
      setNewPrescription({ ...newPrescription, [name]: value });
    }
  };

  // Handle adding a new prescription
  const handleAddPrescription = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/prescriptions`, newPrescription);
      setNewPrescription({
        date_issued: '',
        medication_details: '',
        dosage: '',
        patient_id: '',
        doctor_id: '',
        pharmacist_id: '',
        status: '',
      });
      // Refetch prescriptions to update the list
      const prescriptionRes = await axios.get(`${BASE_URL}/api/prescriptions`);
      setPrescriptions(prescriptionRes.data);
      setError(null);
    } catch (err) {
      setError('Error adding prescription.');
    }
  };

  // Handle deleting a prescription
  const handleDeletePrescription = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/prescriptions/${id}`);
      setPrescriptions(prescriptions.filter(p => p.prescription_id !== id));
    } catch (err) {
      setError('Error deleting prescription.');
    }
  };

  // Handle updating a prescription
  const handleUpdatePrescription = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/prescriptions/${editingPrescription.prescription_id}`, editingPrescription);
      setEditingPrescription(null);
      // Refetch prescriptions to update the list
      const prescriptionRes = await axios.get(`${BASE_URL}/api/prescriptions`);
      setPrescriptions(prescriptionRes.data);
      setError(null);
    } catch (err) {
      setError('Error updating prescription.');
    }
  };

  return (
    <div className="ml-[20%] p-4">
      <h1 className="text-2xl font-semibold mb-4">Prescription Management</h1>

      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Form to add new prescription */}
      <form onSubmit={handleAddPrescription} className="mb-4 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-medium mb-2">Add New Prescription</h2>
        <input
          type="date"
          name="date_issued"
          value={newPrescription.date_issued}
          onChange={handleInputChange}
          className="p-2 border rounded mr-2 mb-2 w-full"
        />
        <input
          type="text"
          name="medication_details"
          value={newPrescription.medication_details}
          onChange={handleInputChange}
          placeholder="Medication Details"
          className="p-2 border rounded mr-2 mb-2 w-full"
        />
        <input
          type="text"
          name="dosage"
          value={newPrescription.dosage}
          onChange={handleInputChange}
          placeholder="Dosage"
          className="p-2 border rounded mr-2 mb-2 w-full"
        />
        <select
          name="patient_id"
          value={newPrescription.patient_id}
          onChange={handleInputChange}
          className="p-2 border rounded mr-2 mb-2 w-full"
        >
          <option value="">Select Patient</option>
          {patients.map(patient => (
            <option key={patient.patient_id} value={patient.patient_id}>
              {patient.first_name} {patient.last_name}
            </option>
          ))}
        </select>
        <select
          name="doctor_id"
          value={newPrescription.doctor_id}
          onChange={handleInputChange}
          className="p-2 border rounded mr-2 mb-2 w-full"
        >
          <option value="">Select Doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.first_name} {doctor.last_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="status"
          value={newPrescription.status}
          onChange={handleInputChange}
          placeholder="Status"
          className="p-2 border rounded mr-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Add Prescription
        </button>
      </form>

      {/* Prescription List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Date Issued</th>
              <th className="p-3 text-left">Medication Details</th>
              <th className="p-3 text-left">Dosage</th>
              <th className="p-3 text-left">Patient Name</th>
              <th className="p-3 text-left">Doctor Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(prescription => (
              <tr key={prescription.prescription_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{prescription.date_issued}</td>
                <td className="p-3">{prescription.medication_details}</td>
                <td className="p-3">{prescription.dosage}</td>
                <td className="p-3">{prescription.patient_first_name} {prescription.patient_last_name}</td>
                <td className="p-3">{prescription.doctor_first_name} {prescription.doctor_last_name}</td>
                <td className="p-3">{prescription.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => setEditingPrescription(prescription)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2 hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePrescription(prescription.prescription_id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing Prescription */}
      {editingPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h2 className="text-lg font-medium mb-2">Edit Prescription</h2>
            <form onSubmit={handleUpdatePrescription}>
              <input
                type="date"
                name="date_issued"
                value={editingPrescription.date_issued}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="text"
                name="medication_details"
                value={editingPrescription.medication_details}
                onChange={handleInputChange}
                placeholder="Medication Details"
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="text"
                name="dosage"
                value={editingPrescription.dosage}
                onChange={handleInputChange}
                placeholder="Dosage"
                className="p-2 border rounded mb-2 w-full"
              />
              <select
                name="patient_id"
                value={editingPrescription.patient_id}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
              <select
                name="doctor_id"
                value={editingPrescription.doctor_id}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.first_name} {doctor.last_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="status"
                value={editingPrescription.status}
                onChange={handleInputChange}
                placeholder="Status"
                className="p-2 border rounded mb-2 w-full"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingPrescription(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && <p className="text-gray-500">Loading...</p>}
    </div>
  );
}

export default Prescriptions;
