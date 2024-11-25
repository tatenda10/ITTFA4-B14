const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/Inventory/Inventory');

// Get all medications in inventory
router.get('/', inventoryController.getAllMedications);

// Get specific medication details by ID
router.get('/:id', inventoryController.getMedicationById);

// Add new medication to inventory
router.post('/', inventoryController.addMedication);

// Update medication details
router.put('/:id', inventoryController.updateMedication);

// Remove medication from inventory
router.delete('/:id', inventoryController.deleteMedication);

module.exports = router;
