const connection = require('../../config/db');
const bcrypt = require('bcrypt');

// Get all pharmacists
const getAllPharmacists = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT pharmacist_id, first_name, last_name, phone_number, email, pharmacy_address, username FROM Pharmacist');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific pharmacist by ID
const getPharmacistById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT pharmacist_id, first_name, last_name, phone_number, email, pharmacy_address, username FROM Pharmacist WHERE pharmacist_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pharmacist not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new pharmacist
const createPharmacist = async (req, res) => {
  const { first_name, last_name, phone_number, email, pharmacy_address, username, password } = req.body;
  
  let conn;

  try {
    // Get a connection from the pool
    conn = await connection.getConnection();

    // Start a transaction
    await conn.beginTransaction();

    // Insert into the Pharmacist table
    const [pharmacistResult] = await conn.query(
      'INSERT INTO Pharmacist (first_name, last_name, phone_number, email, pharmacy_address, username) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, phone_number, email, pharmacy_address, username]
    );

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the Admin table
    await conn.query(
      'INSERT INTO Admin (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'pharmacist']
    );

    // Commit the transaction
    await conn.commit();

    res.status(201).json({ message: 'Pharmacist created', pharmacistId: pharmacistResult.insertId });
  } catch (error) {
    // Rollback the transaction in case of error
    if (conn) await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
};

// Update a pharmacist
const updatePharmacist = async (req, res) => {
  const { first_name, last_name, phone_number, email, pharmacy_address, username } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE Pharmacist SET first_name = ?, last_name = ?, phone_number = ?, email = ?, pharmacy_address = ?, username = ? WHERE pharmacist_id = ?',
      [first_name, last_name, phone_number, email, pharmacy_address, username, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pharmacist not found' });
    }
    res.json({ message: 'Pharmacist updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a pharmacist
const deletePharmacist = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Pharmacist WHERE pharmacist_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pharmacist not found' });
    }
    res.json({ message: 'Pharmacist deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPharmacists,
  getPharmacistById,
  createPharmacist,
  updatePharmacist,
  deletePharmacist
};
