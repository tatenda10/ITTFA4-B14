import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';
import { AuthContext } from '../../contexts/AuthContext';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the patient's prescriptions using the username
    axios.post(`${BASE_URL}/api/patients/prescriptions`, { username: user.username })
      .then((response) => setPrescriptions(response.data))
      .catch((error) => console.error("Error fetching prescriptions:", error));
  }, [user.username]);

  return (
    <div className="ml-[20%] p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">My Prescriptions</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prescriptions</h2>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Medication</th>
              <th className="p-3">Dosage</th>
              <th className="p-3">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.prescription_id} className="border-b">
                <td className="p-3">{prescription.medication_details}</td>
                <td className="p-3">{prescription.dosage}</td>
                <td className="p-3">{prescription.doctor_first_name} {prescription.doctor_last_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prescriptions;
