import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

const buildFormData = (payload) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (value instanceof File) {
      fd.append(key, value);
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
};

const unwrapMaybe = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data;
  }
  return body;
};

export const companiesService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/company', { params });
    return normalizePaginated(res);
  },

  getMine: async () => {
    const res = await axiosInstance.get('/dashboard/owner/company');
    return unwrapMaybe(res);
  },

  // Owner self-service edit of their OWN company. Backend resolves the company
  // from the authed user (tenancy-safe) — POST (real route, not _method spoof)
  // so multipart logo uploads work.
  updateMine: async (payload) => {
    const fd = buildFormData(payload);
    const res = await axiosInstance.post('/dashboard/owner/company', fd);
    return unwrapMaybe(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/company/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const fd = buildFormData(payload);
    const res = await axiosInstance.post('/dashboard/company', fd);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const fd = buildFormData(payload);
    fd.append('_method', 'PUT');
    const res = await axiosInstance.post(`/dashboard/company/${id}`, fd);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/company/${id}`);
    return res.data;
  },
};
