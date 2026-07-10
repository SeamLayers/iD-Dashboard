"use client";

import { useAuth } from './AuthProvider';

/**
 * Canonical role flags derived from the auth context.
 *
 * `isOwner` deliberately excludes superadmins so owner-scoped UI
 * (single-company filters, restricted actions) never leaks onto
 * superadmin sessions that also carry the `owner` role.
 */
export function useRole() {
  const { hasRole, isReady } = useAuth();

  const isSuperadmin = hasRole('superadmin');
  const isOwner = !isSuperadmin && hasRole('owner');
  const role = isSuperadmin ? 'superadmin' : isOwner ? 'owner' : 'member';

  return { isSuperadmin, isOwner, role, isReady };
}
