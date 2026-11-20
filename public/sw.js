const CACHE_NAME = 'lab6-pwa-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/about.html',
    '/style.css',
    '/manifest.json'
];

// Установка Service Worker и кеширование файлов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кеширование файлов приложения');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Активация и очистка старых кешей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Перехват запросов и выдача данных из кеша (офлайн-режим)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse; // Возвращаем из кеша, если есть
                }
                return fetch(event.request); // Иначе идем в сеть
            })
    );
});