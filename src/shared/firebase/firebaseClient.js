/**
 * Firebase Cloud Messaging (web push) client helpers.
 *
 * Everything is lazily initialised INSIDE functions and guarded by
 * `typeof window` + `isSupported()` because:
 *   - the dashboard is a static export (`output: 'export'`), so these client
 *     modules are still evaluated during prerender where `window`/SW APIs
 *     don't exist;
 *   - FCM web support is partial (Safari/iOS/Firefox), so every entry point
 *     must fail soft and return null rather than throw.
 *
 * The public Firebase web config + VAPID key are safe to embed in the client
 * (they identify the project, they are not secrets). They are read from
 * NEXT_PUBLIC_* env (inlined at build) with a literal fallback so push works
 * even if the env vars are absent from a given build.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDsFSFm2PaiQogltZ5T8mrSBEoj0QFD5bc',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'idplus88.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'idplus88',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'idplus88.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1073833089404',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1073833089404:web:755c0e76661ea2d8336cf9',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-S2ZZW2L1J7',
};

const VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
  'BNIPO0B9ac3zLIBARa5mzJWRgPTlbr1zUsZB7jnVYkiW99tXMEDmFyWlMpRds-N0iwfRtDMroUV8ZPPlXeYAAeU';

const SW_URL = '/firebase-messaging-sw.js';

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/** Current browser notification permission, or 'unsupported'. */
export function getNotificationPermission() {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'unsupported';
  }
  return Notification.permission; // 'granted' | 'denied' | 'default'
}

/** Resolves to true when this browser can do FCM web push. */
export async function pushIsSupported() {
  if (
    typeof window === 'undefined' ||
    typeof Notification === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return false;
  }
  try {
    return await isSupported();
  } catch {
    return false;
  }
}

/** Lazily gets a messaging instance, or null when unsupported. */
async function getMessagingInstance() {
  if (!(await pushIsSupported())) return null;
  try {
    return getMessaging(getFirebaseApp());
  } catch {
    return null;
  }
}

/** Registers the background service worker (idempotent). */
async function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    return (
      (await navigator.serviceWorker.getRegistration(SW_URL)) ||
      (await navigator.serviceWorker.register(SW_URL))
    );
  } catch {
    return null;
  }
}

/**
 * Requests notification permission (if not decided) and returns a real FCM
 * web token, or null on any failure / denial / unsupported browser.
 *
 * @param {{ requestPermission?: boolean }} [opts] when requestPermission is
 *   false the token is only fetched if permission was ALREADY granted (used
 *   for the silent post-login refresh so we never prompt on load).
 */
export async function getFcmToken({ requestPermission = true } = {}) {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  let permission = getNotificationPermission();
  if (permission === 'default' && requestPermission) {
    try {
      permission = await Notification.requestPermission();
    } catch {
      return null;
    }
  }
  if (permission !== 'granted') return null;

  const registration = await registerServiceWorker();
  if (!registration) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch {
    return null;
  }
}

/**
 * Subscribes to foreground messages. Returns an unsubscribe function (a no-op
 * when unsupported). The callback receives the FCM payload.
 */
export function onForegroundMessage(callback) {
  let unsubscribe = () => {};
  let cancelled = false;
  getMessagingInstance().then((messaging) => {
    if (!messaging) return;
    try {
      const dispose = onMessage(messaging, callback);
      // If the caller already cleaned up before this resolved, dispose now so
      // we never leak a live listener (guards React StrictMode double-invoke).
      if (cancelled) dispose();
      else unsubscribe = dispose;
    } catch {
      /* ignore */
    }
  });
  return () => {
    cancelled = true;
    unsubscribe();
  };
}
