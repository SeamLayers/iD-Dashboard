import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * The API speaks two different error shapes:
 *  1. ResponseHelper::error → { success:false, message:string, errors?:{field:string[]} }
 *  2. FormRequest validation → { success:true, message:{ field:{en,ar} | string[] | string }, data:null }
 *
 * The second one puts a *localized object* under `message`, so `message` is NOT
 * always a string. getApiErrorMessage() below normalizes both into a single
 * human string — critical, because a raw object reaching a toast/JSX child
 * throws "Objects are not valid as a React child" and hard-crashes the page.
 */
type LocalizedMessage = { en?: string; ar?: string; [k: string]: unknown };
type ValidationMessageMap = Record<string, LocalizedMessage | string[] | string>;

interface LaravelErrorEnvelope {
  success?: boolean;
  message?: string | ValidationMessageMap;
  errors?: Record<string, string[]>;
}

/** Current UI language, mirroring the request interceptor's Accept-Language logic. */
function currentLang(): 'ar' | 'en' {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('idplus_lang');
  const fromHtml =
    typeof document !== 'undefined' ? document.documentElement.lang : null;
  return (stored || fromHtml || 'en').startsWith('ar') ? 'ar' : 'en';
}

/** Coerce any single field-error value ({en,ar} | string[] | string) to a string. */
function fieldErrorToString(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (Array.isArray(value)) {
    const first = value.find((v) => typeof v === 'string' && v.trim());
    return (first as string) || null;
  }
  if (value && typeof value === 'object') {
    const loc = value as LocalizedMessage;
    const lang = currentLang();
    const picked = (loc[lang] ?? loc.en ?? loc.ar) as string | undefined;
    if (typeof picked === 'string' && picked.trim()) return picked.trim();
    // Fall back to the first stringifiable leaf so an object never escapes.
    for (const v of Object.values(loc)) {
      const s = fieldErrorToString(v);
      if (s) return s;
    }
  }
  return null;
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

    // Shape 1: ResponseHelper::error → { errors: { field: [msg] } }
    if (data?.errors) {
      const firstField = Object.values(data.errors)[0];
      const msg = fieldErrorToString(firstField);
      if (msg) return msg;
    }

    // Shape 2: FormRequest validation → message is an OBJECT keyed by field,
    // each value {en,ar} | string[] | string. Never return the raw object.
    if (data?.message && typeof data.message === 'object') {
      const firstField = Object.values(data.message as ValidationMessageMap)[0];
      const msg = fieldErrorToString(firstField);
      if (msg) return msg;
    }

    // Plain string message (most non-validation errors).
    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }

    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
