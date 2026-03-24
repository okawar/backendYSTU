// Пользовательский класс ошибки для операционных ошибок API
class AppError extends Error {
  // Принимает HTTP-код статуса и сообщение об ошибке
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    // Флаг для отличия операционных ошибок от программных
    this.isOperational = true;
  }
}

module.exports = AppError;
