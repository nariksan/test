const CACHE_NAME = 'snt-isabella-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // Добавьте сюда пути к вашим иконкам, когда они будут готовы: '/icon-192.png', '/icon-512.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование файлов PWA...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов и отдача из кэша (стратегия Cache First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Возвращаем из кэша
        }
        return fetch(event.request); // Если нет в кэше, идем в сеть
      })
  );
});

// Очистка старого кэша при обновлении версии
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});