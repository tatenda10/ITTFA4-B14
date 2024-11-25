import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust path as necessary
import { BASE_URL } from '../../services/Api';

function Patients() {
  const { user } = useContext(AuthContext); // Get user from context
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (user && user.role === 'doctor') {
        try {
          const response = await axios.post(`${BASE_URL}/api/doctors/patients`, {
            username: user.username, // Send username in request body
          });
          setPatients(response.data);
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      }
    };

    fetchPatients();
  }, [user]);

  return (
    <div className='ml-[20%] p-2'>
      <h1 className='text-2xl font-semibold mb-4'>Patients</h1>
      {patients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Date of Birth</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Medical History</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.patient_id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="py-3 px-4">{patient.first_name}</td>
                  <td className="py-3 px-4">{patient.last_name}</td>
                  <td className="py-3 px-4">{new Date(patient.dob).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{patient.gender}</td>
                  <td className="py-3 px-4">{patient.phone_number}</td>
                  <td className="py-3 px-4">{patient.email}</td>
                  <td className="py-3 px-4">{patient.address}</td>
                  <td className="py-3 px-4">{patient.medical_history}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
}

export default Patients;
