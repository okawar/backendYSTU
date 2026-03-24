# Movie API

REST API для управления каталогом фильмов

## Описание предметной области

Приложение для каталога фильмов. Позволяет добавлять, просматривать, редактировать и удалять фильмы. Доступ к функциональности только для авторизованных пользователей через JWT-токены.

## Стек технологий

- **Node.js** — среда выполнения
- **Express** — веб-фреймворк
- **PostgreSQL 17** — база данных
- **JWT (jsonwebtoken)** — аутентификация по токенам
- **bcryptjs** — хэширование паролей
- **express-validator** — валидация входных данных

## Как запустить проект

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/okawar/backendYSTU.git
   cd backendYSTU
   ```

2. Установить зависимости:
   ```bash
   npm install
   ```

3. Создать файл `.env` в корне проекта:
   ```
   PORT=3000
   DB_HOST=<хост базы данных>
   DB_PORT=<порт базы данных>
   DB_USER=<имя пользователя>
   DB_PASSWORD=<пароль>
   DB_NAME=<имя базы данных>
   JWT_SECRET=<секретный ключ для JWT>
   ```

4. Запустить миграцию (создание таблиц и тестового пользователя):
   ```bash
   npm run migrate
   ```

5. Запустить сервер в dev-режиме:
   ```bash
   npm run dev
   ```

## Структура проекта

```
src/
├── app.js                          # Главный файл приложения Express
├── server.js                       # Точка входа — запуск сервера
├── controllers/
│   ├── authController.js           # Логика авторизации (login, logout)
│   └── movieController.js          # CRUD-логика для фильмов
├── db/
│   ├── pool.js                     # Пул соединений с PostgreSQL
│   └── migrate.js                  # Скрипт миграции базы данных
├── middleware/
│   ├── authMiddleware.js           # Проверка JWT-токена
│   ├── errorHandler.js             # Глобальный обработчик ошибок
│   └── notFound.js                 # Обработка несуществующих маршрутов (404)
├── routes/
│   ├── auth.js                     # Маршруты авторизации
│   └── movies.js                   # Маршруты фильмов
├── utils/
│   └── AppError.js                 # Класс операционных ошибок
└── validators/
    ├── authValidator.js            # Валидация данных авторизации
    └── movieValidator.js           # Валидация данных фильмов
```

## API маршруты

| Метод  | URL              | Описание                          | Авторизация |
|--------|------------------|-----------------------------------|-------------|
| POST   | /auth/login      | Авторизация пользователя          | Нет         |
| POST   | /auth/logout     | Выход из системы                  | Да          |
| GET    | /movies          | Получить все фильмы               | Да          |
| GET    | /movies/:id      | Получить фильм по id              | Да          |
| POST   | /movies          | Создать новый фильм               | Да          |
| PUT    | /movies/:id      | Полное обновление фильма          | Да          |
| PATCH  | /movies/:id      | Частичное обновление фильма       | Да          |
| DELETE | /movies/:id      | Удалить фильм                     | Да          |

## Примеры запросов

### Логин

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

Ответ (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "admin" }
}
```

### Создание фильма

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "Интерстеллар", "director": "Кристофер Нолан", "releaseYear": 2014, "rating": 8.6}'
```

Ответ (201):
```json
{
  "id": 1,
  "title": "Интерстеллар",
  "director": "Кристофер Нолан",
  "releaseYear": 2014,
  "rating": "8.6",
  "available": true,
  "createdAt": "2026-03-24T12:00:00.000Z"
}
```

### Получение списка фильмов

```bash
curl http://localhost:3000/movies \
  -H "Authorization: Bearer <token>"
```

Ответ (200):
```json
[
  {
    "id": 1,
    "title": "Интерстеллар",
    "director": "Кристофер Нолан",
    "releaseYear": 2014,
    "rating": "8.6",
    "available": true,
    "createdAt": "2026-03-24T12:00:00.000Z"
  }
]
```

### Получение фильма по id

```bash
curl http://localhost:3000/movies/1 \
  -H "Authorization: Bearer <token>"
```

Ответ (200):
```json
{
  "id": 1,
  "title": "Интерстеллар",
  "director": "Кристофер Нолан",
  "releaseYear": 2014,
  "rating": "8.6",
  "available": true,
  "createdAt": "2026-03-24T12:00:00.000Z"
}
```

### PUT — полное обновление фильма

```bash
curl -X PUT http://localhost:3000/movies/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "Интерстеллар", "director": "Кристофер Нолан", "releaseYear": 2014, "rating": 9.0, "available": true}'
```

Ответ (200):
```json
{
  "id": 1,
  "title": "Интерстеллар",
  "director": "Кристофер Нолан",
  "releaseYear": 2014,
  "rating": "9.0",
  "available": true,
  "createdAt": "2026-03-24T12:00:00.000Z"
}
```

### PATCH — частичное обновление фильма

```bash
curl -X PATCH http://localhost:3000/movies/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"rating": 9.5}'
```

Ответ (200):
```json
{
  "id": 1,
  "title": "Интерстеллар",
  "director": "Кристофер Нолан",
  "releaseYear": 2014,
  "rating": "9.5",
  "available": true,
  "createdAt": "2026-03-24T12:00:00.000Z"
}
```

### Удаление фильма

```bash
curl -X DELETE http://localhost:3000/movies/1 \
  -H "Authorization: Bearer <token>"
```

Ответ (200):
```json
{
  "message": "Фильм успешно удалён",
  "movie": {
    "id": 1,
    "title": "Интерстеллар",
    "director": "Кристофер Нолан",
    "releaseYear": 2014,
    "rating": "9.5",
    "available": true,
    "createdAt": "2026-03-24T12:00:00.000Z"
  }
}
```

## Обработка ошибок

Все ошибки возвращаются в едином формате:

```json
{ "error": { "code": <число>, "message": "<описание>" } }
```

### Примеры ошибок

**400 — Некорректный запрос:**
```json
{ "error": { "code": 400, "message": "Параметр id должен быть положительным целым числом" } }
```

**401 — Не авторизован:**
```json
{ "error": { "code": 401, "message": "Токен доступа не предоставлен" } }
```

**404 — Не найдено:**
```json
{ "error": { "code": 404, "message": "Фильм с id 99 не найден" } }
```

**405 — Метод не поддерживается:**
```json
{ "error": { "code": 405, "message": "Метод PUT не поддерживается для /auth/login" } }
```

**422 — Ошибка валидации:**
```json
{
  "error": {
    "code": 422,
    "message": "Ошибка валидации",
    "details": [
      { "field": "title", "message": "Название обязательно" },
      { "field": "releaseYear", "message": "Год выпуска должен быть целым числом от 1888 до 2030" }
    ]
  }
}
```

**500 — Внутренняя ошибка сервера:**
```json
{ "error": { "code": 500, "message": "Внутренняя ошибка сервера" } }
```

## Сущность Movie

| Поле        | Тип в JSON | Тип в БД         | Обязательно | Ограничения                     |
|-------------|------------|-------------------|-------------|---------------------------------|
| id          | number     | SERIAL            | Авто        | PRIMARY KEY                     |
| title       | string     | VARCHAR(100)      | Да          | От 2 до 100 символов            |
| director    | string     | VARCHAR(100)      | Да          | От 2 до 100 символов            |
| releaseYear | number     | INTEGER           | Да          | От 1888 до 2030                 |
| rating      | number     | NUMERIC(3,1)      | Нет         | От 0.0 до 10.0                  |
| available   | boolean    | BOOLEAN           | Нет         | По умолчанию true               |
| createdAt   | string     | TIMESTAMP         | Авто        | По умолчанию NOW()              |

## Валидация

### POST /movies (создание)
- **title** — обязательно, строка, 2–100 символов, автоматический trim
- **director** — обязательно, строка, 2–100 символов, автоматический trim
- **releaseYear** — обязательно, целое число от 1888 до 2030
- **rating** — необязательно, число от 0 до 10
- **available** — необязательно, строго boolean

### PUT /movies/:id (полное обновление)
- Все поля обязательны, правила те же

### PATCH /movies/:id (частичное обновление)
- Все поля необязательны, но если переданы — проверяются по тем же правилам
- Если не передано ни одного допустимого поля — ошибка 400

### POST /auth/login
- **username** — обязательно, автоматический trim
- **password** — обязательно

---

Тестовый пользователь: `admin` / `password123`
