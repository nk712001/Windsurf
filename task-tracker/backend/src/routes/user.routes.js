const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.register);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', userController.login);

// @route   GET api/users/verify/:token
// @desc    Verify user's email
// @access  Public
router.get('/verify/:token', userController.verifyEmail);

// @route   POST api/users/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', userController.forgotPassword);

// @route   POST api/users/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;
