const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/Patients/Patients');

// Get all patients
router.get('/', patientController.getAllPatients);

// Get a specific patient by ID
router.get('/:id', patientController.getPatientById);

// Create a new patient
router.post('/', patientController.createPatient);

// Update a patient
router.put('/:id', patientController.updatePatient);

// Delete a patient
router.delete('/:id', patientController.deletePatient);


router.put('/:patient_id/assign-doctor', patientController.assignDoctorToPatient);

router.post('/appointments', patientController.getAppointmentsByPatient);

router.post('/create-appointment', patientController.createAppointment );

router.post('/prescriptions', patientController.getPrescriptionsByPatient );

module.exports = router;
