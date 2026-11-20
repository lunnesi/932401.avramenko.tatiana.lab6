const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Middleware для логирования каждого запроса в консоль
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// 2. Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// 3. API-маршрут: GET /api/greet/:name?lang=ru
app.get('/api/greet/:name', (req, res) => {
    const { name } = req.params;
    const lang = req.query.lang === 'ru' ? 'ru' : 'en'; // по умолчанию en

    // Валидация name: не пустой и без спецсимволов (только буквы, цифры, дефис, подчеркивание)
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9_-]+$/;
    if (!name || !nameRegex.test(name)) {
        return res.status(400).json({ error: "Invalid name" });
    }

    // Формируем приветствие в зависимости от языка
    let message = '';
    if (lang === 'ru') {
        message = `Привет, ${name}!`;
    } else {
        message = `Hello, ${name}!`;
    }

    // Отправляем JSON-ответ
    res.json({
        message,
        timestamp: new Date().toISOString(),
        lang
    });
});

// 4. Обработка ошибки 404 (маршрут не найден) для всех остальных запросов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});