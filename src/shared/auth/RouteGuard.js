"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useAuth } from './AuthProvider';

const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password'];

export default function RouteGuard({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
    }
    if (isAuthenticated && isPublic) {
      router.replace('/');
    }
  }, [isReady, isAuthenticated, isPublic, router]);

  if (!isReady) {
    return (
      <div className="route-guard-splash">
        <div className="splash-content">
          <h1 className="logo text-gradient text-glow">iD+</h1>
          <p className="splash-subtle">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublic) return null;
  if (isAuthenticated && isPublic) return null;

  return children;
}
