// Загружаем переменные окружения до всех остальных импортов
require('dotenv').config();

const express = require('express');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

// Импорт middleware для обработки ошибок
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Парсинг JSON-тел запросов — подключаем до маршрутов, чтобы req.body был доступен
app.use(express.json());

// Маршруты — подключаем после парсера, но до обработчиков ошибок
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

// Обработка несуществующих маршрутов — после всех маршрутов,
// чтобы ловить только запросы, не попавшие ни в один роутер
app.use(notFound);

// Глобальный обработчик ошибок — самый последний middleware,
// потому что Express передаёт ошибки в обработчик с 4 аргументами (err, req, res, next)
app.use(errorHandler);

module.exports = app;
