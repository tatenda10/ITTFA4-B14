const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/Admin');

// Get all admins
router.get('/', adminController.getAllAdmins);

// Get specific admin details by ID
router.get('/:id', adminController.getAdminById);

// Create a new admin
router.post('/', adminController.createAdmin);

// Update an admin's details
router.put('/:id', adminController.updateAdmin);

// Delete an admin
router.delete('/:id', adminController.deleteAdmin);


router.get('/stats', adminController.getStats);

module.exports = router;
