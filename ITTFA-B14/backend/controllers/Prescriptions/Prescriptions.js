const connection = require('../../config/db');

// Get all prescriptions along with patient and doctor names
const getAllPrescriptions = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.prescription_id,
        p.date_issued,
        p.medication_details,
        p.dosage,
        p.status,
        pa.first_name AS patient_first_name,
        pa.last_name AS patient_last_name,
        d.first_name AS doctor_first_name,
        d.last_name AS doctor_last_name
      FROM Prescription p
      JOIN Patient pa ON p.patient_id = pa.patient_id
      JOIN Doctor d ON p.doctor_id = d.doctor_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific prescription by ID along with patient and doctor names
const getPrescriptionById = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.prescription_id,
        p.date_issued,
        p.medication_details,
        p.dosage,
        p.status,
        pa.first_name AS patient_first_name,
        pa.last_name AS patient_last_name,
        d.first_name AS doctor_first_name,
        d.last_name AS doctor_last_name
      FROM Prescription p
      JOIN Patient pa ON p.patient_id = pa.patient_id
      JOIN Doctor d ON p.doctor_id = d.doctor_id
      WHERE p.prescription_id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new prescription
const createPrescription = async (req, res) => {
  const { date_issued, medication_details, dosage, patient_id, status, username } = req.body; // Add username to req.body

  try {
    // Get doctor_id based on username
    const [doctorResult] = await connection.query(
      'SELECT doctor_id FROM Doctor WHERE username = ?',
      [username]
    );

    if (doctorResult.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctor_id = doctorResult[0].doctor_id;

    // Insert new prescription
    const [result] = await connection.query(
      'INSERT INTO Prescription (date_issued, medication_details, dosage, patient_id, doctor_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [date_issued, medication_details, dosage, patient_id, doctor_id, status]
    );

    res.status(201).json({ message: 'Prescription created', prescriptionId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


// Update a prescription
const updatePrescription = async (req, res) => {
  const { date_issued, medication_details, dosage, patient_id, doctor_id, status } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE Prescription SET date_issued = ?, medication_details = ?, dosage = ?, patient_id = ?, doctor_id = ?, status = ? WHERE prescription_id = ?',
      [date_issued, medication_details, dosage, patient_id, doctor_id, status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json({ message: 'Prescription updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a prescription
const deletePrescription = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Prescription WHERE prescription_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted' });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
};
