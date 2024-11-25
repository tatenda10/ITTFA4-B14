const connection = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await connection.query('SELECT * FROM Admin WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      {
        adminId: admin.admin_id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token, role, and username in the response
    res.json({ token, role: admin.role, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
};
