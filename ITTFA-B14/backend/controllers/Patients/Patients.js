const connection = require('../../config/db');
const bcrypt = require('bcrypt');

// Get all patients
// Get all patients with doctor information
const getAllPatients = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT p.*, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
      FROM Patient p
      LEFT JOIN Doctor d ON p.doctor_id = d.doctor_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific patient by ID with doctor information
const getPatientById = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT p.*, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
      FROM Patient p
      LEFT JOIN Doctor d ON p.doctor_id = d.doctor_id
      WHERE p.patient_id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new patient
const createPatient = async (req, res) => {
  const { first_name, last_name, dob, gender, phone_number, email, address, medical_history, username, password } = req.body;

  let conn; // Use 'conn' to avoid confusion with imported 'connection'

  try {
    // Get a connection from the pool
    conn = await connection.getConnection();

    // Start a transaction
    await conn.beginTransaction();

    // Insert into the Patient table
    const [patientResult] = await conn.query(
      'INSERT INTO Patient (first_name, last_name, dob, gender, phone_number, email, address, medical_history, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, dob, gender, phone_number, email, address, medical_history, username]
    );

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the Admin table with role as 'patient'
    await conn.query(
      'INSERT INTO Admin (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'patient']
    );

    // Commit the transaction
    await conn.commit();

    // Send a success response
    res.status(201).json({ message: 'Patient created', patientId: patientResult.insertId });
  } catch (error) {
    // Rollback the transaction in case of error
    if (conn) await conn.rollback();

    // Send an error response
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
};




// Update a patient
const updatePatient = async (req, res) => {
  const { first_name, last_name, dob, gender, phone_number, email, address, medical_history } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE Patient SET first_name = ?, last_name = ?, dob = ?, gender = ?, phone_number = ?, email = ?, address = ?, medical_history = ? WHERE patient_id = ?',
      [first_name, last_name, dob, gender, phone_number, email, address, medical_history, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a patient
const deletePatient = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Patient WHERE patient_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign a doctor to a patient
const assignDoctorToPatient = async (req, res) => {
  const { doctor_id } = req.body;
  const { patient_id } = req.params;

  try {
    const [result] = await connection.query(
      'UPDATE Patient SET doctor_id = ? WHERE patient_id = ?',
      [doctor_id, patient_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Doctor assigned to patient successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAppointmentsByPatient = async (req, res) => {
  const { username } = req.body; // Assume you're passing the username in the request body

  try {
    // Fetch the patient_id based on the patient's username
    const [patientResult] = await connection.query(
      'SELECT patient_id FROM Patient WHERE username = ?',
      [username]
    );

    if (patientResult.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient_id = patientResult[0].patient_id;

    // Fetch appointments associated with the patient_id
    const [appointments] = await connection.query(
      `SELECT a.*, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name 
       FROM Appointment a 
       LEFT JOIN Doctor d ON a.doctor_id = d.doctor_id 
       WHERE a.patient_id = ?`,
      [patient_id]
    );

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAppointment = async (req, res) => {
  const { date, time, reason, doctor_id, username } = req.body;
 console.log(req.body)
  try {
    // Get the patient_id based on the username
    const [patientResult] = await connection.query(
      'SELECT patient_id FROM Patient WHERE username = ?',
      [username]
    );

    if (patientResult.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient_id = patientResult[0].patient_id;

    // Create the appointment
    const [result] = await connection.query(
      'INSERT INTO Appointment (appointment_date, reason, status, patient_id, doctor_id) VALUES (?, ?, ?, ?, ?)',
      [`${date} ${time}`, reason, 'Scheduled', patient_id, doctor_id]
    );

    res.status(201).json({ message: 'Appointment created', appointmentId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { username } = req.body;

    // Fetch the patient_id based on the username
    const [patientResult] = await connection.query(
      'SELECT patient_id FROM Patient WHERE username = ?',
      [username]
    );

    if (patientResult.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient_id = patientResult[0].patient_id;

    // Fetch prescriptions associated with the patient_id
    const [prescriptions] = await connection.query(
      `SELECT p.*, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name 
       FROM Prescription p 
       JOIN Doctor d ON p.doctor_id = d.doctor_id
       WHERE p.patient_id = ?`,
      [patient_id]
    );

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  assignDoctorToPatient,
  getAppointmentsByPatient,
  createAppointment,
  getPrescriptionsByPatient
};
