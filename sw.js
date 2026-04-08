// sw.js - PWA Only (No Push Notifications)
const CACHE_NAME = 'hoblemecy-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/mydashboard.html',
  '/auth.html',
  '/logo.png',
  '/hero.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip Supabase requests (always go to network)
  if (event.request.url.includes('supabase.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});