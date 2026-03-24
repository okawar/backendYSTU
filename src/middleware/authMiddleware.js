const jwt = require('jsonwebtoken');

// Middleware для проверки JWT-токена в заголовке Authorization
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Проверяем наличие заголовка и формат "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { code: 401, message: 'Токен доступа не предоставлен' },
      });
    }

    // Извлекаем токен из заголовка
    const token = authHeader.split(' ')[1];

    // Верифицируем токен и сохраняем данные пользователя в req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Токен невалидный или просрочен
    return res.status(401).json({
      error: { code: 401, message: 'Недействительный или просроченный токен' },
    });
  }
}

module.exports = authMiddleware;
