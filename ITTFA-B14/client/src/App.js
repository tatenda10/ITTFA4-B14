import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';

import SidebarDoctor from './components/SidebarDoctor'
import Sidebar from './components/Sidebar';

import SidebarPatient from './components/SidebarPatient';
import SidebarPharmacist from './components/SidebarPharmacist';


import AppointmentsDoctor from './pages/Doctor/Appointments'
import PatientsDoctor from './pages/Doctor/Patients'
import PrescriptionsDoctor from './pages/Doctor/Prescriptions'
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

import PharmacistDashboard from './pages/Pharmacist/PharmacistDashboard';
import PharmacyInventory from './pages/Pharmacist/Inventory'
import PharmacyPrescriptions from './pages/Pharmacist/Prescriptions'


import PatientDashboard from './pages/Patient/PatientDashboard';
import PatientAppointments from './pages/Patient/Appointments';
import PatientPrescriptions from './pages/Patient/Prescriptions'


import AdminPrescriptions from './pages/Admin/Prescriptions'
import PatientManagement from './pages/Admin/PatientManagement';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Users from './pages/Admin/UserManagement';
import AdminInventory from './pages/Admin/Inventory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/doctor/*" element={<DoctorLayout />} />
            <Route path="/pharmacist/*" element={<PharmacistLayout />} />
            <Route path="/patient/*" element={<PatientLayout />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="prescriptions" element={<AdminPrescriptions />} />
          <Route path="inventory" element={<AdminInventory />} />

        </Routes>
      </div>
    </div>
  );
}

function DoctorLayout() {
  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<DoctorDashboard />} />
          <Route path="appointments" element={<AppointmentsDoctor />} />
          <Route path="prescriptions" element={<PrescriptionsDoctor />} />
          <Route path="patients" element={<PatientsDoctor />} />
        </Routes>
      </div>
    </div>
  );
}


function PharmacistLayout() {
  return (
    <div className="flex">
      <SidebarPharmacist />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<PharmacistDashboard />} />
          <Route path="prescriptions" element={<PharmacyPrescriptions />} />
          <Route path="inventory" element={<PharmacyInventory />} />
        </Routes>
      </div>
    </div>
  );
}


function PatientLayout() {
  return (
    <div className="flex">
      <SidebarPatient />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="appointments" element={<PatientAppointments />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
