const { Router } = require('express');
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateIdParam,
  createMovieValidator,
  updateMovieValidator,
  patchMovieValidator,
  handleValidationErrors,
} = require('../validators/movieValidator');

const router = Router();

// Все маршруты фильмов защищены авторизацией
router.use(authMiddleware);

// GET / — получить все фильмы
router.get('/', movieController.getAll);

// GET /:id — получить фильм по id
router.get('/:id', validateIdParam, movieController.getById);

// POST / — создать новый фильм
router.post('/', createMovieValidator, handleValidationErrors, movieController.create);

// PUT /:id — полное обновление фильма
router.put('/:id', validateIdParam, updateMovieValidator, handleValidationErrors, movieController.update);

// PATCH /:id — частичное обновление фильма
router.patch('/:id', validateIdParam, patchMovieValidator, handleValidationErrors, movieController.patch);

// DELETE /:id — удалить фильм
router.delete('/:id', validateIdParam, movieController.remove);

// all() стоит после конкретных маршрутов, потому что Express проверяет маршруты по порядку.
// Конкретные методы (GET, POST и т.д.) совпадут первыми, а all() поймает всё остальное.

// Обработка неподдерживаемых методов для /movies
router.all('/', (req, res) => {
  res.status(405).json({
    error: { code: 405, message: `Метод ${req.method} не поддерживается для /movies` },
  });
});

// Обработка неподдерживаемых методов для /movies/:id
router.all('/:id', (req, res) => {
  res.status(405).json({
    error: { code: 405, message: `Метод ${req.method} не поддерживается для /movies/${req.params.id}` },
  });
});

module.exports = router;
