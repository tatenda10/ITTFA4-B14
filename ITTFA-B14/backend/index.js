const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors'); // Import the cors package
require('dotenv').config(); 

const app = express();


app.use(bodyParser.json());
app.use(cors()); // Use cors middleware
const patientRoutes = require('./routes/Patients/Patients');
const doctorRoutes = require('./routes/Doctors/Doctors');
const appointmentRoutes = require('./routes/Appointments/Appointments');
const prescriptionRoutes = require('./routes/Prescriptions/Prescriptions');
const pharmacistRoutes = require('./routes/Pharmacist/Pharmacist');
const inventoryRoutes = require('./routes/Inventory/Inventory');
const orderRoutes = require('./routes/Orders/Orders');
const adminRoutes = require('./routes/Admin/Admin');
const reportRoutes = require('./routes/Reports/Reports');
const Auth = require('./routes/Auth/Auth');


app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/pharmacist', pharmacistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', Auth);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

 