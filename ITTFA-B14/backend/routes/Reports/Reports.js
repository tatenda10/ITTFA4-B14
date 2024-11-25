const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/Reports/Reports');

// Get all reports
router.get('/', reportController.getAllReports);

// Get specific report details by ID
router.get('/:id', reportController.getReportById);

// Generate a new report
router.post('/', reportController.generateReport);

// Delete a report
router.delete('/:id', reportController.deleteReport);

module.exports = router;
