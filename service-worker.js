const CACHE_NAME = 'offline-game-cache-v1';
const urlsToCache = [
    'game/game.html',
    'game/game.css',
    'game/game.js',
    // Add more assets
];

self.addEventListener('install', event => {
    // Perform the install step: caching the custom game files
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    if (!navigator.onLine) {
        // Serve the custom game when offline
        event.respondWith(
            caches.match('game/game.html')
        );
    } else {
        // Try to fetch the resource from the network
        event.respondWith(
            fetch(event.request).catch(() => {
                // If the network request fails, serve the custom game
                return caches.match('game/game.html');
            })
        );
    }
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
        })
    );
});

