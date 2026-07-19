"use client";

/**
 * Runs inside the authenticated shell and:
 *   1. silently upgrades the stored device_token to a real FCM web token once
 *      the user has granted notification permission (login sends a placeholder
 *      because permission is usually granted AFTER the login POST);
 *   2. shows a toast + refreshes the notifications bell when a push arrives
 *      while the dashboard tab is focused (foreground messages).
 *
 * Renders nothing. All FCM calls fail soft on unsupported browsers.
 */
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useUpdateDeviceToken } from '@/shared/api/hooks';
import { queryKeys } from '@/shared/api/hooks/queryKeys';
import {
  getFcmToken,
  onForegroundMessage,
  getNotificationPermission,
} from '@/shared/firebase/firebaseClient';

export default function PushNotificationsManager() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const { mutate: saveToken } = useUpdateDeviceToken();
  const syncedRef = useRef(false);

  // Silent token upgrade (only when permission was already granted).
  useEffect(() => {
    if (!isAuthenticated) {
      syncedRef.current = false;
      return;
    }
    if (syncedRef.current) return;
    let cancelled = false;
    (async () => {
      if (getNotificationPermission() !== 'granted') return;
      const token = await getFcmToken({ requestPermission: false });
      if (!cancelled && token) {
        syncedRef.current = true;
        saveToken(token);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, saveToken]);

  // Foreground push → toast + refresh the bell.
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = onForegroundMessage((payload) => {
      const n = (payload && payload.notification) || {};
      const title = n.title || 'iD+';
      const body = n.body || '';
      toast.success(body ? `${title} — ${body}` : title);
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    });
    return () => unsubscribe();
  }, [isAuthenticated, qc]);

  return null;
}
