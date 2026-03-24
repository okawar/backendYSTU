// Middleware для обработки запросов к несуществующим маршрутам
function notFound(req, res, next) {
  res.status(404).json({
    error: { code: 404, message: 'Маршрут не найден' },
  });
}

module.exports = notFound;
