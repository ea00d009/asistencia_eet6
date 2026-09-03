const CACHE_NAME = 'asistencia-eet6-v2';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

// Instalación: Precacheo del app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación: Limpieza de versiones viejas de caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Fetch
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Peticiones a Google Apps Script / APIs: Siempre a la red (sin cachear POSTs ni datos dinámicos)
  if (url.hostname.includes('script.google.com') || request.method !== 'GET') {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Sin conexión a internet. Verificá tu red para sincronizar con Google Sheets.' 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 2. CDNs externos (Bootstrap, Fonts, Icons): Stale-While-Revalidate
  if (url.hostname.includes('cdn.jsdelivr.net') || 
      url.hostname.includes('fonts.googleapis.com') || 
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Activos locales (App Shell): Network-first con fallback a caché
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
