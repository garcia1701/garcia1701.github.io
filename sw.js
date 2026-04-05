importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCdncrUozHk7Izh4xExqCGwNNMCBaon9uY",
  authDomain: "peguerinos-cd378.firebaseapp.com",
  projectId: "peguerinos-cd378",
  storageBucket: "peguerinos-cd378.firebasestorage.app",
  messagingSenderId: "724770006648",
  appId: "1:724770006648:web:4d3881925041bc62a52f8d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification.title;
  const body = payload.notification.body;
  self.registration.showNotification(title, {
    body: body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200]
  });
});

const CACHE_NAME = 'ptp-cache-v5';

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
  if (e.request.method !== 'GET') return;
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
