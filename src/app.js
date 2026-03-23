// Загружаем переменные окружения из .env
require('dotenv').config();

const express = require('express');

// Создаём экземпляр приложения Express
const app = express();

// Подключаем парсер JSON для обработки тела запросов
app.use(express.json());

// Тестовый маршрут для проверки работоспособности сервера
app.get('/', (req, res) => {
  res.json({ message: 'Movie API is running' });
});

module.exports = app;
