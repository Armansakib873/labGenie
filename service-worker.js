const CACHE_NAME = 'labgenie-v22.0';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/report.css',
  './css/sop.css',
  './css/sop2.css',
  './css/app.css',
  './js/sop/boot.js',
  './js/sop/tests.js',
  './js/sop/tests2a.js',
  './js/sop/tests2b.js',
  './js/sop/handling.js',
  './js/sop/methods.js',
  './js/sop/visuals.js',
  './js/sop/guides.js',
  './js/sop/atlas-haem.js',
  './js/sop/bloodbank.js',
  './js/sop/learn.js',
  './js/sop/sop.js',
  './js/app/ux.js',
  './js/report/catalog.js',
  './js/report/engine.js',
  './js/report/signature.js',
  './js/report/render.js',
  './js/report/export.js',
  './js/report/ui.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  // Force the waiting service worker to become the active service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Caching failed: ', err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const whitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (!whitelist.includes(key)) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // App code (pages, scripts, styles, manifest): network-first so updates
  // always arrive; the cached copy is only used when offline.
  if (url.origin === self.location.origin && (event.request.mode === 'navigate' || /\.(html|js|css|json)$/.test(url.pathname) || url.pathname.endsWith('/'))) {
    event.respondWith(
      fetch(event.request)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkRes;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true })
          .then(r => r || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
    );
    return;
  }

  // Everything else (icons, images, fonts): cache-first.
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      return cachedRes || fetch(event.request)
        .then(networkRes => {
          // Check if we received a valid response from our own origin
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // Offline fallback for page navigation
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
