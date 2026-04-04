const CACHE_NAME = 'ptp-cache-v3';
const BASE = '/peguerinos/';

const ARCHIVOS = [
  BASE + 'index.html',
  BASE + 'calendario_2026.html',
  BASE + 'actividades_eventos.html',
  BASE + 'galeria.html',
  BASE + 'historia_peña.html',
  BASE + 'contacto.html',
  BASE + 'enlaces.html',
  BASE + 'acceso-socios.html',
  BASE + 'panel-socio.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'peña1.jpeg',
  BASE + 'toro_enfadado.gif',
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
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
