const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/Doctors/Doctors');

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Get a specific doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Create a new doctor
router.post('/', doctorController.createDoctor);

// Update a doctor
router.put('/:id', doctorController.updateDoctor);

// Delete a doctor
router.delete('/:id', doctorController.deleteDoctor);


router.post('/patients',  doctorController.getPatientsByDoctor);


router.post('/prescriptions',  doctorController.getPrescriptionsByDoctor);


router.post('/appointments',  doctorController.getAppointmentsByDoctor);

module.exports = router;
