const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginValidator, handleAuthValidation } = require('../validators/authValidator');

const router = Router();

// POST /login — авторизация с валидацией входных данных
router.post('/login', loginValidator, handleAuthValidation, authController.login);

// POST /logout — выход, требует авторизации
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
