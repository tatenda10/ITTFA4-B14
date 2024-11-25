import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';

function UserManagement() {
  const [doctors, setDoctors] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'admin', 'doctor', 'pharmacist'
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    address: '',
    username: '',
    password: '',
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserType, setCurrentUserType] = useState('');

  useEffect(() => {
    // Fetch doctors
    axios.get(`${BASE_URL}/api/doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));

    // Fetch pharmacists
    axios.get(`${BASE_URL}/api/pharmacist`)
      .then((response) => setPharmacists(response.data))
      .catch((error) => console.error("Error fetching pharmacists:", error));

    // Fetch admins
    axios.get(`${BASE_URL}/api/admins`)
      .then((response) => setAdmins(response.data))
      .catch((error) => console.error("Error fetching admins:", error));
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setFormData({
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      address: '',
      username: '',
      password: '',
    });
  };

  const openEditModal = (user, type) => {
    setModalType(type);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      email: user.email,
      address: user.address,
      username: user.username,
      password: '', // Leave this blank for security reasons, user can enter a new password if needed
    });
    setCurrentUserId(user.id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      address: '',
      username: '',
      password: '',
    });
  };

  const openDeleteModal = (id, type) => {
    setCurrentUserId(id);
    setCurrentUserType(type);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentUserId(null);
    setCurrentUserType('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let apiEndpoint;

    switch (modalType) {
      case 'admin':
        apiEndpoint = `${BASE_URL}/api/admins`;
        break;
      case 'doctor':
        apiEndpoint = `${BASE_URL}/api/doctors`;
        break;
      case 'pharmacist':
        apiEndpoint = `${BASE_URL}/api/pharmacist`;
        break;
      default:
        return;
    }

    axios.post(apiEndpoint, formData)
      .then((response) => {
        closeModal();
        if (modalType === 'admin') setAdmins([...admins, response.data]);
        if (modalType === 'doctor') setDoctors([...doctors, response.data]);
        if (modalType === 'pharmacist') setPharmacists([...pharmacists, response.data]);
        fetchDoctors();
        fetchPharmacists();
        fetchAdmins();

      })
      .catch((error) => {
        console.error("There was an error creating the user!", error);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    let apiEndpoint;

    switch (modalType) {
      case 'admin':
        apiEndpoint = `${BASE_URL}/api/admins/${currentUserId}`;
        break;
      case 'doctor':
        apiEndpoint = `${BASE_URL}/api/doctors/${currentUserId}`;
        break;
      case 'pharmacist':
        apiEndpoint = `${BASE_URL}/api/pharmacist/${currentUserId}`;
        break;
      default:
        return;
    }

    axios.put(apiEndpoint, formData)
      .then((response) => {
        closeEditModal();
        if (modalType === 'admin') setAdmins(admins.map(admin => admin.id === currentUserId ? response.data : admin));
        if (modalType === 'doctor') setDoctors(doctors.map(doctor => doctor.doctor_id  === currentUserId ? response.data : doctor));
        if (modalType === 'pharmacist') setPharmacists(pharmacists.map(pharmacist => pharmacist.id === currentUserId ? response.data : pharmacist));
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);
      });
  };
  const fetchDoctors = () => {
    axios.get(`${BASE_URL}/api/doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  };
  const fetchPharmacists = () => {
    axios.get(`${BASE_URL}/api/pharmacists`)
      .then((response) => setPharmacists(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  };
  const fetchAdmins = () => {
    axios.get(`${BASE_URL}/api/admins`)
      .then((response) => setPharmacists(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  };
  
  useEffect(() => {
    fetchDoctors();  // Fetch doctors on component load
    fetchPharmacists();

    // Fetch pharmacists
    axios.get(`${BASE_URL}/api/pharmacists`)
      .then((response) => setPharmacists(response.data))
      .catch((error) => console.error("Error fetching pharmacists:", error));
  
    // Fetch admins
    axios.get(`${BASE_URL}/api/admins`)
      .then((response) => setAdmins(response.data))
      .catch((error) => console.error("Error fetching admins:", error));
  }, []);
  
  const handleDelete = () => {
    let apiEndpoint;

    switch (currentUserType) {
      case 'admin':
        apiEndpoint = `${BASE_URL}/api/admins/${currentUserId}`;
        break;
      case 'doctor':
        apiEndpoint = `${BASE_URL}/api/doctors/${currentUserId}`;
        break;
      case 'pharmacist':
        apiEndpoint = `${BASE_URL}/api/pharmacist/${currentUserId}`;
        break;
      default:
        return;
    }

    axios.delete(apiEndpoint)
      .then(() => {
        closeDeleteModal();
        if (currentUserType === 'admin') setAdmins(admins.filter(admin => admin.id !== currentUserId));
        if (currentUserType === 'doctor') setDoctors(doctors.filter(doctor => doctor.id !== currentUserId));
        if (currentUserType === 'pharmacist') setPharmacists(pharmacists.filter(pharmacist => pharmacist.id !== currentUserId));
        fetchDoctors();  // Fetch the updated list of doctors

      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
  };

  return (
    <div className="flex-1 p-6 ml-[20%] bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">User Management</h1>
      <div className="mb-8">
        <button onClick={() => openModal('admin')} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 mr-4">
          Create Admin
        </button>
        <button onClick={() => openModal('doctor')} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 mr-4">
          Create Doctor
        </button>
        <button onClick={() => openModal('pharmacist')} className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700">
          Create Pharmacist
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctors</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id} className="border-b">
                <td className="p-3">{doctor.username}</td>
                <td className="p-3">{doctor.email}</td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => openDeleteModal(doctor.doctor_id, 'doctor')} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pharmacists</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacists.map(pharmacist => (
              <tr key={pharmacist.id} className="border-b">
                <td className="p-3">{pharmacist.username}</td>
                <td className="p-3">{pharmacist.email}</td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => openDeleteModal(pharmacist.id, 'pharmacist')} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admins</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Username</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b">
                <td className="p-3">{admin.username}</td>
               
                <td className="p-3 flex space-x-2">
                  <button onClick={() => openDeleteModal(admin.id, 'admin')} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating Users */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
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
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Users */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
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
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                required
              />
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
                placeholder="New Password (Optional)"
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Deleting Users */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this {currentUserType}?</p>
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={closeDeleteModal} 
                className="p-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                className="p-3 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
