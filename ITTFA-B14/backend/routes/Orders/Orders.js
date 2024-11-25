const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Orders/Orders');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get specific order details by ID
router.get('/:id', orderController.getOrderById);

// Place a new order for medication
router.post('/', orderController.placeOrder);

// Update an order's status
router.put('/:id', orderController.updateOrder);

// Cancel an order
router.delete('/:id', orderController.cancelOrder);

module.exports = router;
