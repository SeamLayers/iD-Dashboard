"use client";

import { useAuth } from './AuthProvider';

export default function PermissionGate({ permission, anyOf, role, fallback = null, children }) {
  const { hasPermission, hasAnyPermission, hasRole } = useAuth();

  if (permission && !hasPermission(permission)) return fallback;
  if (anyOf && !hasAnyPermission(anyOf)) return fallback;
  if (role && !hasRole(role)) return fallback;

  return children;
}
