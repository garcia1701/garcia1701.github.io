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
    icon: '/peguerinos/icon-192.png',
    badge: '/peguerinos/icon-192.png',
    vibrate: [200, 100, 200]
  });
});
