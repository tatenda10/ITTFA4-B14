const connection = require('../../config/db');

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM Report');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific report details by ID
const getReportById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM Report WHERE report_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate a new report
const generateReport = async (req, res) => {
  const { report_type, generated_by, data } = req.body;
  const generated_date = new Date();
  try {
    const [result] = await connection.query(
      'INSERT INTO Report (report_type, generated_date, generated_by, data) VALUES (?, ?, ?, ?)',
      [report_type, generated_date, generated_by, data]
    );
    res.status(201).json({ message: 'Report generated', reportId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM Report WHERE report_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  generateReport,
  deleteReport
};
