const CACHE_NAME = 'ptp-cache-v4';

const ARCHIVOS = [
  '/index.html',
  '/calendario_2026.html',
  '/actividades_eventos.html',
  '/galeria.html',
  '/historia_peña.html',
  '/contacto.html',
  '/enlaces.html',
  '/acceso-socios.html',
  '/panel-socio.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/peña1.jpeg',
  '/toro_enfadado.gif',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const copia = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copia));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
