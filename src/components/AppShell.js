"use client";

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import RouteGuard from '@/shared/auth/RouteGuard';
import ForcePasswordResetModal from './ForcePasswordResetModal';
import PushNotificationsManager from './PushNotificationsManager';

const AUTH_PAGES = ['/login', '/forgot-password', '/reset-password'];

export default function AppShell({ children, locale }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (locale) localStorage.setItem('idplus_lang', locale);
  }, [locale]);

  if (isAuthPage) {
    return <RouteGuard>{children}</RouteGuard>;
  }

  return (
    <RouteGuard>
      <div className="layout-wrapper">
        <Sidebar />
        <div className="main-content">
          <TopNavbar />
          {children}
        </div>
      </div>
      {/* Forced first-login password reset (temp password → own password). */}
      <ForcePasswordResetModal />
      {/* Web-push token sync + foreground notification toasts (FCM). */}
      <PushNotificationsManager />
    </RouteGuard>
  );
}
