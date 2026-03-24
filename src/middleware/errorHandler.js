const AppError = require('../utils/AppError');

// Глобальный обработчик ошибок Express
function errorHandler(err, req, res, next) {
  // Если ошибка — экземпляр AppError, возвращаем её код и сообщение
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.statusCode, message: err.message },
    });
  }

  // Если клиент прислал некорректный JSON в теле запроса
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 400, message: 'Некорректный JSON в теле запроса' },
    });
  }

  // Все остальные ошибки — внутренние, логируем для разработчика
  console.error(err);
  return res.status(500).json({
    error: { code: 500, message: 'Внутренняя ошибка сервера' },
  });
}

module.exports = errorHandler;
