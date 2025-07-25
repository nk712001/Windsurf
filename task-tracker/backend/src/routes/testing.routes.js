const express = require('express');
const router = express.Router();
const { seedAndVerifyUser, getResetToken } = require('../controllers/testing.controller');

// This route should only be enabled in a test environment
router.post('/seed-user', seedAndVerifyUser);
router.get('/reset-token', getResetToken);

module.exports = router;
