const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// GET /api/auth/me
router.get('/me', authRequired, AuthController.me);

// POST /api/auth/logout
router.post('/logout', authRequired, AuthController.logout);

module.exports = router;
