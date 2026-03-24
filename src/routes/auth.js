const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginValidator, handleAuthValidation } = require('../validators/authValidator');

const router = Router();

// POST /login — авторизация с валидацией входных данных
router.post('/login', loginValidator, handleAuthValidation, authController.login);

// POST /logout — выход, требует авторизации
router.post('/logout', authMiddleware, authController.logout);

// all() стоит после конкретных маршрутов, потому что Express проверяет маршруты по порядку.
// Конкретные методы (POST) совпадут первыми, а all() поймает всё остальное.

router.all('/login', (req, res) => {
  res.status(405).json({
    error: { code: 405, message: `Метод ${req.method} не поддерживается для /auth/login` },
  });
});

router.all('/logout', (req, res) => {
  res.status(405).json({
    error: { code: 405, message: `Метод ${req.method} не поддерживается для /auth/logout` },
  });
});

module.exports = router;
