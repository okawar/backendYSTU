const { body, param, validationResult } = require('express-validator');

// Middleware для проверки параметра id в URL
function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  // id должен быть положительным целым числом
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: { code: 400, message: 'Параметр id должен быть положительным целым числом' },
    });
  }

  next();
}

// Общие правила валидации полей фильма
const titleRule = (field) =>
  field.isString().withMessage('Название должно быть строкой')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Название должно содержать от 2 до 100 символов');

const directorRule = (field) =>
  field.isString().withMessage('Режиссёр должен быть строкой')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Режиссёр должен содержать от 2 до 100 символов');

const releaseYearRule = (field) =>
  field.isInt({ min: 1888, max: 2030 }).withMessage('Год выпуска должен быть целым числом от 1888 до 2030');

const ratingRule = (field) =>
  field.isFloat({ min: 0, max: 10 }).withMessage('Рейтинг должен быть числом от 0 до 10');

const availableRule = (field) =>
  field.isBoolean({ strict: true }).withMessage('Доступность должна быть boolean');

// Валидация для создания фильма (POST) — все основные поля обязательны
const createMovieValidator = [
  titleRule(body('title').notEmpty().withMessage('Название обязательно')),
  directorRule(body('director').notEmpty().withMessage('Режиссёр обязателен')),
  releaseYearRule(body('releaseYear').notEmpty().withMessage('Год выпуска обязателен')),
  ratingRule(body('rating').optional()),
  availableRule(body('available').optional()),
];

// Валидация для полного обновления (PUT) — все поля обязательны
const updateMovieValidator = [
  titleRule(body('title').notEmpty().withMessage('Название обязательно')),
  directorRule(body('director').notEmpty().withMessage('Режиссёр обязателен')),
  releaseYearRule(body('releaseYear').notEmpty().withMessage('Год выпуска обязателен')),
  ratingRule(body('rating').notEmpty().withMessage('Рейтинг обязателен')),
  availableRule(body('available').exists({ values: 'falsy' }).withMessage('Доступность обязательна')),
];

// Валидация для частичного обновления (PATCH) — все поля необязательны
const patchMovieValidator = [
  titleRule(body('title').optional()),
  directorRule(body('director').optional()),
  releaseYearRule(body('releaseYear').optional()),
  ratingRule(body('rating').optional()),
  availableRule(body('available').optional()),
];

// Middleware для обработки результатов валидации
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  // Если есть ошибки — возвращаем 422 со списком
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

module.exports = {
  validateIdParam,
  createMovieValidator,
  updateMovieValidator,
  patchMovieValidator,
  handleValidationErrors,
};
