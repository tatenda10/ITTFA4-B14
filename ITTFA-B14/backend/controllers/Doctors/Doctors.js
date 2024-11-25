const connection = require('../../config/db');
const bcrypt = require('bcrypt');

// Get all doctors
const getAllDoctors = async ( req, res) => {
  try {
    const [rows] = await connection.query('SELECT doctor_id, first_name, last_name, speciality, phone_number, email, office_address, username FROM Doctor');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT doctor_id, first_name, last_name, speciality, phone_number, email, office_address, username FROM Doctor WHERE doctor_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new doctor
const createDoctor = async (req, res) => {
  const { first_name, last_name, speciality, phone_number, email, office_address, username, password } = req.body;
  console.log(req.body)
  let conn;

  try {
    // Get a connection from the pool
    conn = await connection.getConnection();

    // Start a transaction
    await conn.beginTransaction();

    // Insert into the Doctor table
    const [doctorResult] = await conn.query(
      'INSERT INTO Doctor (first_name, last_name, speciality, phone_number, email, office_address, username) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, speciality, phone_number, email, office_address, username]
    );

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the Admin table
    await conn.query(
      'INSERT INTO Admin (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'doctor']
    );

    // Commit the transaction
    await conn.commit();

    res.status(201).json({ message: 'Doctor created', doctorId: doctorResult.insertId });
  } catch (error) {
    // Rollback the transaction in case of error
    if (conn) await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  const { first_name, last_name, speciality, phone_number, email, office_address, username } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE Doctor SET first_name = ?, last_name = ?, speciality = ?, phone_number = ?, email = ?, office_address = ?, username = ? WHERE doctor_id = ?',
      [first_name, last_name, speciality, phone_number, email, office_address, username, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Doctor WHERE doctor_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getPatientsByDoctor = async (req, res) => {
  try {
    const { username } = req.body; // Assuming you set req.user in your authentication middleware
    console.log(username)
    // Fetch the doctor_id based on the doctor's username
    const [doctorResult] = await connection.query(
      'SELECT doctor_id FROM Doctor WHERE username = ?',
      [username]
    );

    if (doctorResult.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctor_id = doctorResult[0].doctor_id;
    console.log(doctor_id)
    // Fetch patients associated with the doctor_id
    const [patients] = await connection.query(
      'SELECT * FROM Patient WHERE doctor_id = ?',
      [doctor_id]
    );

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { username } = req.body;

    // Fetch the doctor_id based on the doctor's username
    const [doctorResult] = await connection.query(
      'SELECT doctor_id FROM Doctor WHERE username = ?',
      [username]
    );

    if (doctorResult.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctor_id = doctorResult[0].doctor_id;

    // Fetch prescriptions associated with the doctor_id
    const [prescriptions] = await connection.query(
      `SELECT p.*, 
              pat.first_name AS patient_first_name, 
              pat.last_name AS patient_last_name,
              ph.first_name AS pharmacist_first_name, 
              ph.last_name AS pharmacist_last_name 
       FROM Prescription p
       LEFT JOIN Patient pat ON p.patient_id = pat.patient_id
       LEFT JOIN Pharmacist ph ON p.pharmacist_id = ph.pharmacist_id
       WHERE p.doctor_id = ?`,
      [doctor_id]
    );

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { username } = req.body; // Assuming you pass the username in the request body

    // Fetch the doctor_id based on the doctor's username
    const [doctorResult] = await connection.query(
      'SELECT doctor_id FROM Doctor WHERE username = ?',
      [username]
    );

    if (doctorResult.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctor_id = doctorResult[0].doctor_id;

    // Fetch appointments associated with the doctor_id and include patient names
    const [appointments] = await connection.query(
      `SELECT a.appointment_id, a.appointment_date, a.reason, a.status, 
              p.patient_id, p.first_name AS patient_first_name, p.last_name AS patient_last_name
       FROM Appointment a
       JOIN Patient p ON a.patient_id = p.patient_id
       WHERE a.doctor_id = ?`,
      [doctor_id]
    );

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getPatientsByDoctor,
  getPrescriptionsByDoctor,
  getAppointmentsByDoctor
};
