/* iD+ dashboard — Firebase Cloud Messaging background service worker.
 *
 * This is a STATIC file served from the site root (/firebase-messaging-sw.js)
 * because the dashboard is a Next.js static export (`output: 'export'`) — a SW
 * cannot be a route and cannot read the app's env, so the Firebase config is
 * re-declared here as public literals (these values are not secrets; they
 * identify the project only).
 *
 * It uses the compat SDK from gstatic via importScripts (runs inside the SW,
 * not subject to the page CSP). Keep the version in sync with the installed
 * `firebase` package's major line.
 */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDsFSFm2PaiQogltZ5T8mrSBEoj0QFD5bc',
  authDomain: 'idplus88.firebaseapp.com',
  projectId: 'idplus88',
  storageBucket: 'idplus88.firebasestorage.app',
  messagingSenderId: '1073833089404',
  appId: '1:1073833089404:web:755c0e76661ea2d8336cf9',
});

const messaging = firebase.messaging();

// Fired when a push arrives while the site is in the background / tab closed.
messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || 'iD+';
  const options = {
    body: notification.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
    tag: (payload.data && payload.data.tag) || undefined,
  };
  self.registration.showNotification(title, options);
});

// Focus (or open) the dashboard when a background notification is clicked.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return undefined;
    })
  );
});
