const pool = require('../db/pool');
const AppError = require('../utils/AppError');

// Маппинг camelCase → snake_case для полей фильма
const fieldMap = {
  title: 'title',
  director: 'director',
  releaseYear: 'release_year',
  rating: 'rating',
  available: 'available',
};

// Преобразование объекта фильма из snake_case (БД) в camelCase (клиент)
function toCamelCase(movie) {
  return {
    id: movie.id,
    title: movie.title,
    director: movie.director,
    releaseYear: movie.release_year,
    rating: movie.rating,
    available: movie.available,
    createdAt: movie.created_at,
  };
}

// Получить все фильмы
async function getAll(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY id');
    res.json(result.rows.map(toCamelCase));
  } catch (err) {
    next(err);
  }
}

// Получить фильм по id
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);

    // Если фильм не найден — возвращаем 404
    if (result.rows.length === 0) {
      return next(new AppError(404, `Фильм с id ${id} не найден`));
    }

    res.json(toCamelCase(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

// Создать новый фильм
async function create(req, res, next) {
  try {
    const { title, director, releaseYear, rating, available } = req.body;

    const result = await pool.query(
      `INSERT INTO movies (title, director, release_year, rating, available)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, director, releaseYear, rating ?? null, available ?? true]
    );

    res.status(201).json(toCamelCase(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

// Полное обновление фильма (PUT)
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, director, releaseYear, rating, available } = req.body;

    const result = await pool.query(
      `UPDATE movies SET title=$1, director=$2, release_year=$3, rating=$4, available=$5
       WHERE id=$6 RETURNING *`,
      [title, director, releaseYear, rating, available, id]
    );

    // Если фильм не найден — возвращаем 404
    if (result.rows.length === 0) {
      return next(new AppError(404, `Фильм с id ${id} не найден`));
    }

    res.json(toCamelCase(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

// Частичное обновление фильма (PATCH)
async function patch(req, res, next) {
  try {
    const { id } = req.params;

    // Собираем только переданные допустимые поля
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) {
        fields.push(`${snake}=$${idx}`);
        values.push(req.body[camel]);
        idx++;
      }
    }

    // Если не переданы допустимые поля — ошибка
    if (fields.length === 0) {
      return next(new AppError(400, 'Не переданы поля для обновления'));
    }

    values.push(id);

    // Строим динамический SQL-запрос
    const result = await pool.query(
      `UPDATE movies SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`,
      values
    );

    // Если фильм не найден — возвращаем 404
    if (result.rows.length === 0) {
      return next(new AppError(404, `Фильм с id ${id} не найден`));
    }

    res.json(toCamelCase(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

// Удалить фильм
async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);

    // Если фильм не найден — возвращаем 404
    if (result.rows.length === 0) {
      return next(new AppError(404, `Фильм с id ${id} не найден`));
    }

    res.json({ message: 'Фильм успешно удалён', movie: toCamelCase(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, patch, remove };
