const express = require('express');
const router = express.Router();
const prescriptionController = require('../../controllers/Prescriptions/Prescriptions');

// Get all prescriptions
router.get('/', prescriptionController.getAllPrescriptions);

// Get a specific prescription by ID
router.get('/:id', prescriptionController.getPrescriptionById);

// Create a new prescription
router.post('/', prescriptionController.createPrescription);

// Update a prescription
router.put('/:id', prescriptionController.updatePrescription);

// Delete a prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
