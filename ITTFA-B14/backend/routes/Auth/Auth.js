const express = require('express');
const router = express.Router();
const authController = require('../../controllers/Auth/Auth');

// Login route
router.post('/login', authController.login);

module.exports = router;
