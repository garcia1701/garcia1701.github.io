// Service Worker — Peña Taurina Peguerinos
// Notificaciones push gestionadas por OneSignalSDKWorker.js
// Este SW solo gestiona el caché de la app

const CACHE_NAME = 'ptp-cache-v7';

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
  '/solicitud_ingreso.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/peña1.jpeg',
  '/toro_enfadado.gif',
];

// URLs que NUNCA deben cachearse
const NO_CACHEAR = [
  'script.google.com',
  'script.googleusercontent.com',
  'onesignal.com',
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
  if (e.request.method !== 'GET') return;

  // No interceptar peticiones a APIs externas
  const url = e.request.url;
  if (NO_CACHEAR.some(dominio => url.includes(dominio))) {
    return; // deja pasar sin tocar
  }

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
