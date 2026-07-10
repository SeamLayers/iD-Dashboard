import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface LaravelErrorEnvelope {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://idplus.cfd/ID-platform/api/v1';

export const ACCESS_TOKEN_KEY = 'idplus_token';
export const USER_KEY = 'idplus_user';
export const PERMISSIONS_KEY = 'idplus_permissions';
export const ROLES_KEY = 'idplus_roles';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // The host's WAF (LiteSpeed mod_security) returns a 403 for POST/PUT/PATCH
    // requests that carry an empty body. Action endpoints such as
    // business-cards/{id}/submit|publish|deactivate are called without a
    // payload, so send an empty JSON object to satisfy the WAF.
    const method = (config.method || 'get').toLowerCase();
    if (['post', 'put', 'patch'].includes(method) && (config.data === undefined || config.data === null)) {
      config.data = {};
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const lang = localStorage.getItem('idplus_lang');
      if (lang) {
        config.headers['Accept-Language'] = lang;
      } else {
        const fromHtml = typeof document !== 'undefined' ? document.documentElement.lang : null;
        config.headers['Accept-Language'] = fromHtml || 'en';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<LaravelErrorEnvelope>) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.includes('/login')) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PERMISSIONS_KEY);
        localStorage.removeItem(ROLES_KEY);
        const locale = path.startsWith('/ar') ? '/ar' : path.startsWith('/en') ? '/en' : '';
        window.location.href = `${locale || '/ar'}/login/`;
      }
    }

    return Promise.reject(error);
  }
);

export function unwrap<T>(res: AxiosResponse<{ success: boolean; message?: string; data: T }>): T {
  return res.data.data;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export function normalizePaginated<T>(res: AxiosResponse): PaginatedResponse<T> {
  const body = res.data;

  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === 'object' && 'data' in inner && Array.isArray((inner as { data: unknown[] }).data)) {
      return inner as PaginatedResponse<T>;
    }
    if (Array.isArray(inner)) {
      const arr = inner as T[];
      return {
        data: arr,
        current_page: 1,
        last_page: 1,
        per_page: arr.length || 10,
        total: arr.length,
        from: arr.length ? 1 : 0,
        to: arr.length,
      };
    }
  }

  if (body && typeof body === 'object' && Array.isArray((body as { data: unknown }).data)) {
    return body as PaginatedResponse<T>;
  }

  if (Array.isArray(body)) {
    const arr = body as T[];
    return {
      data: arr,
      current_page: 1,
      last_page: 1,
      per_page: arr.length || 10,
      total: arr.length,
      from: arr.length ? 1 : 0,
      to: arr.length,
    };
  }

  return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 };
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as LaravelErrorEnvelope | undefined;
    if (data?.errors) {
      const firstField = Object.values(data.errors)[0];
      if (Array.isArray(firstField) && firstField[0]) return firstField[0];
    }
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
