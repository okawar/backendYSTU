const { body, validationResult } = require('express-validator');

// Правила валидации для запроса на логин
const loginValidator = [
  body('username').notEmpty().withMessage('Логин обязателен').trim(),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

// Middleware для проверки результата валидации
function handleAuthValidation(req, res, next) {
  const errors = validationResult(req);

  // Если есть ошибки валидации — возвращаем 422 со списком ошибок
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        code: 422,
        message: 'Ошибка валидации',
        details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      },
    });
  }

  next();
}

module.exports = { loginValidator, handleAuthValidation };
