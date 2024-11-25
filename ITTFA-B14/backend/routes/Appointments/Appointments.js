const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/Announcements/Appointments');

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get a specific appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Create a new appointment
router.post('/', appointmentController.createAppointment);

// Update an appointment
router.put('/:id', appointmentController.updateAppointment);

// Delete an appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
