const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Авторизация пользователя по логину и паролю
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // Ищем пользователя в базе по имени
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    // Если пользователь не найден — возвращаем ошибку
    if (!user) {
      return next(new AppError(401, 'Неверный логин или пароль'));
    }

    // Сравниваем присланный пароль с хэшем из базы
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return next(new AppError(401, 'Неверный логин или пароль'));
    }

    // Создаём JWT-токен с данными пользователя, срок жизни — 24 часа
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Возвращаем токен и базовую информацию о пользователе
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
}

// Выход пользователя (на стороне сервера ничего не инвалидируем)
async function logout(req, res, next) {
  try {
    res.json({ message: 'Выход выполнен успешно' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout };
