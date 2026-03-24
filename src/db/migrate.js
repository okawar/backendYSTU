const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Создаём отдельный пул для миграции, чтобы не влиять на основной пул приложения
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function migrate() {
  try {
    // Создаём таблицу пользователей, если она ещё не существует
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Создаём таблицу фильмов, если она ещё не существует
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        director VARCHAR(100) NOT NULL,
        release_year INTEGER NOT NULL,
        rating NUMERIC(3,1),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Хэшируем пароль для тестового пользователя
    const hash = await bcrypt.hash('password123', 10);

    // Вставляем тестового пользователя admin, если он ещё не существует
    await pool.query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      ['admin', hash]
    );

    console.log('Миграция завершена');
  } catch (err) {
    console.error('Ошибка миграции:', err);
  } finally {
    // Закрываем пул миграции после завершения
    await pool.end();
  }
}

migrate();
