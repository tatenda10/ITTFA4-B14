const express = require('express');
const router = express.Router();
const pharmacistController = require('../../controllers/Pharmacist/Pharmacist');

// Get all pharmacists
router.get('/', pharmacistController.getAllPharmacists);

// Get a specific pharmacist by ID
router.get('/:id', pharmacistController.getPharmacistById);

// Create a new pharmacist
router.post('/', pharmacistController.createPharmacist);

// Update a pharmacist
router.put('/:id', pharmacistController.updatePharmacist);

// Delete a pharmacist
router.delete('/:id', pharmacistController.deletePharmacist);

module.exports = router;
