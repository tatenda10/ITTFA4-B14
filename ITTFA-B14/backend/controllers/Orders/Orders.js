const connection = require('../../config/db');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM `Order`');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific order details by ID
const getOrderById = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM `Order` WHERE order_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Place a new order for medication
const placeOrder = async (req, res) => {
  const { order_date, medication_id, quantity, status, pharmacist_id } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO `Order` (order_date, medication_id, quantity, status, pharmacist_id) VALUES (?, ?, ?, ?, ?)',
      [order_date, medication_id, quantity, status, pharmacist_id]
    );
    res.status(201).json({ message: 'Order placed', orderId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order's status
const updateOrder = async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await connection.query(
      'UPDATE `Order` SET status = ? WHERE order_id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const [result] = await connection.query('DELETE FROM `Order` WHERE order_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order canceled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  placeOrder,
  updateOrder,
  cancelOrder
};
