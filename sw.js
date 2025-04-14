const CACHE_NAME = 'bar-down-jones-v3'; // Actualizado a v3
const urlsToCache = [
    '/',
    'index.html',
    'styles.css',
    'script.js',
    'manifest.json',
    'crash.mp3',
    'offer.mp3',
    'icons/mojito.png',
    'icons/caipirinha.png',
    'icons/gintonic.png',
    'icons/margarita.png',
    'icons/negroni.png',
    'icons/oldfashioned.png',
    'icons/daiquiri.png',
    'icons/artesanal.png',
    'icons/ipa.png',
    'icons/lager.png',
    'icons/stout.png',
    'icons/pilsner.png',
    'icons/weissbier.png',
    'icons/limonada.png',
    'icons/mojitosin.png',
    'icons/tehelado.png',
    'icons/tonica.png',
    'icons/zumo.png',
    'icons/kombucha.png',
    'icons/smoothie.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => console.log('Archivos cacheados'))
            .catch(err => console.error('Cache error:', err))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(err => console.error('Fetch error:', err))
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => console.log('Caché antiguo limpiado'))
        .catch(err => console.error('Activate error:', err))
    );
});