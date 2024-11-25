const connection = require('../../config/db');

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM Appointment');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM Appointment WHERE appointment_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { appointment_date, reason, status, patient_id, username } = req.body;

  try {
    // Get the doctor_id based on the provided username
    const [doctorResult] = await connection.query(
      'SELECT doctor_id FROM Doctor WHERE username = ?',
      [username]
    );

    if (doctorResult.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctor_id = doctorResult[0].doctor_id;

    // Now insert the appointment using the found doctor_id
    const [result] = await connection.query(
      'INSERT INTO Appointment (appointment_date, reason, status, patient_id, doctor_id) VALUES (?, ?, ?, ?, ?)',
      [appointment_date, reason, status, patient_id, doctor_id]
    );

    res.status(201).json({ message: 'Appointment created', appointmentId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  const { appointment_date, reason, status, patient_id, doctor_id } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE Appointment SET appointment_date = ?, reason = ?, status = ?, patient_id = ?, doctor_id = ? WHERE appointment_id = ?',
      [appointment_date, reason, status, patient_id, doctor_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Appointment WHERE appointment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
