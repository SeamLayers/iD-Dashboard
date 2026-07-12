"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authService } from '../api/services';
import {
  ACCESS_TOKEN_KEY,
  USER_KEY,
  PERMISSIONS_KEY,
  ROLES_KEY,
} from '../api/axios.instance';

const AuthContext = createContext(null);

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setUser(safeParse(localStorage.getItem(USER_KEY)));
    setPermissions(safeParse(localStorage.getItem(PERMISSIONS_KEY)) || []);
    setRoles(safeParse(localStorage.getItem(ROLES_KEY)) || []);
    setToken(localStorage.getItem(ACCESS_TOKEN_KEY));
    setIsReady(true);
  }, []);

  const persist = useCallback((data) => {
    if (typeof window === 'undefined') return;
    if (data?.token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
    }
    const userData = {
      id: data?.id,
      name: data?.name,
      email: data?.email,
      user_type: data?.user_type,
      must_reset_password: Boolean(data?.must_reset_password),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(data?.permissions || []));
    localStorage.setItem(ROLES_KEY, JSON.stringify(data?.roles || []));
  }, []);

  const clear = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
    localStorage.removeItem(ROLES_KEY);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    persist(data);
    setUser({ id: data.id, name: data.name, email: data.email, user_type: data.user_type, must_reset_password: Boolean(data.must_reset_password) });
    setPermissions(data.permissions || []);
    setRoles(data.roles || []);
    setToken(data.token);
    return data;
  }, [persist]);

  // Clears the forced-reset flag after the user changes their temp password.
  const clearMustReset = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, must_reset_password: false };
      if (typeof window !== 'undefined') localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_e) {
      // Even if logout fails server-side, clear locally.
    }
    clear();
    setUser(null);
    setPermissions([]);
    setRoles([]);
    setToken(null);
  }, [clear]);

  const hasPermission = useCallback(
    (perm) => {
      if (!perm) return true;
      if (Array.isArray(perm)) return perm.every((p) => permissions.includes(p));
      return permissions.includes(perm);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (perms) => {
      if (!perms || perms.length === 0) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasRole = useCallback(
    (role) => {
      if (!role) return true;
      if (Array.isArray(role)) return role.some((r) => roles.includes(r));
      return roles.includes(role);
    },
    [roles]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      permissions,
      roles,
      isAuthenticated: Boolean(token && user),
      isReady,
      mustResetPassword: Boolean(user?.must_reset_password),
      login,
      logout,
      clearMustReset,
      hasPermission,
      hasAnyPermission,
      hasRole,
    }),
    [user, token, permissions, roles, isReady, login, logout, clearMustReset, hasPermission, hasAnyPermission, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
