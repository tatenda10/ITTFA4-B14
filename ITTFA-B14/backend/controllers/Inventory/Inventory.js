const connection = require('../../config/db');

// Get all medications in inventory
const getAllMedications = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM Inventory');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific medication details by ID
const getMedicationById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM Inventory WHERE medication_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new medication to inventory
const addMedication = async (req, res) => {
  const { medication_name, stock_level, expiration_date, supplier_name } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO Inventory (medication_name, stock_level, expiration_date, supplier_name) VALUES (?, ?, ?, ?)',
      [medication_name, stock_level, expiration_date, supplier_name]
    );
    res.status(201).json({ message: 'Medication added to inventory', medicationId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update medication details
const updateMedication = async (req, res) => {
  const { medication_name, stock_level, expiration_date, supplier_name } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE Inventory SET medication_name = ?, stock_level = ?, expiration_date = ?, supplier_name = ? WHERE medication_id = ?',
      [medication_name, stock_level, expiration_date, supplier_name, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json({ message: 'Medication details updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove medication from inventory
const deleteMedication = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Inventory WHERE medication_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json({ message: 'Medication removed from inventory' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication
};
