const app = require('./app');

// Берём порт из переменных окружения или используем 3000 по умолчанию
const PORT = process.env.PORT || 3000;

// Запускаем сервер на указанном порту
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
