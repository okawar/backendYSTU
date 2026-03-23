// Загружаем переменные окружения из .env
require('dotenv').config();

const { Pool } = require('pg');

// Создаём пул соединений с PostgreSQL, используя переменные окружения
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Обработка непредвиденных ошибок простаивающих клиентов в пуле
pool.on('error', (err) => {
  console.error('Непредвиденная ошибка клиента PostgreSQL:', err);
  process.exit(-1);
});

// Экспортируем объект с методом query для выполнения SQL-запросов
module.exports = pool;
