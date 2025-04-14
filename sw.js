const CACHE_NAME = 'bar-down-jones-v2';
const urlsToCache = [
    '/',
    'index.html',
    'styles.css',
    'script.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'crash.mp3',
    'offer.mp3',
    'manifest.json',
    'icons/icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(err => console.error('Cache add error:', err));
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {});
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            );
        })
    );
});