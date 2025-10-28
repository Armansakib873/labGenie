const CACHE_NAME = 'labgenie-v3';

const urlsToCache = [
  './',
  './index.html',

  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',

  './features/dilution-calculator.html',
  './features/anticoagulant-calculator.html',
  './features/LDL-calculator.html',
  './features/egfr-calculator.html',
  './features/uacr-calculator.html',
  './features/electrolyte-verification.html',
  './features/osmolality-calculator.html',
  './features/qc-westgard-helper.html',
  './features/manual-report-template.html',
  './features/unit-conversion.html',
  './features/molarity-calculator.html'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Caching failed: ', err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key =>
          whitelist.includes(key) ? null : caches.delete(key)
        )
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request)
        .then(networkRes => {
          if (networkRes.ok &&
              networkRes.type === 'basic') {
            let clone = networkRes.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
          }
          return networkRes;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
