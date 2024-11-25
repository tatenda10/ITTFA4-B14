const connection = require('../../config/db');
const bcrypt = require('bcrypt');

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT admin_id, username, role FROM Admin WHERE role = ?', ['admin']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get specific admin details by ID
const getAdminById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT admin_id, username, role FROM Admin WHERE admin_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      'INSERT INTO Admin (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'admin']
    );
    res.status(201).json({ message: 'Admin created', adminId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an admin's details
const updateAdmin = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    let query = 'UPDATE Admin SET username = ?, role = ? WHERE admin_id = ?';
    const params = [username, role, req.params.id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE Admin SET username = ?, password = ?, role = ? WHERE admin_id = ?';
      params.splice(1, 0, hashedPassword);  // Insert password after username in the params array
    }

    const [result] = await connection.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Admin details updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Admin WHERE admin_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const getStats = async (req, res) => {
  try {
    const [patients] = await connection.query('SELECT COUNT(*) AS count FROM Patients');
    const [doctors] = await connection.query('SELECT COUNT(*) AS count FROM Doctors');
    const [pharmacists] = await connection.query('SELECT COUNT(*) AS count FROM Pharmacists');
    const [appointments] = await connection.query('SELECT COUNT(*) AS count FROM Appointments');

    res.json({
      patients: patients[0].count,
      doctors: doctors[0].count,
      pharmacists: pharmacists[0].count,
      appointments: appointments[0].count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getStats
};
