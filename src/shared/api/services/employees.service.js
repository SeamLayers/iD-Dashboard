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

export const employeesService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/employee', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/employee/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const fd = buildFormData(payload);
    const res = await axiosInstance.post('/dashboard/employee', fd);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const fd = buildFormData(payload);
    fd.append('_method', 'PUT');
    const res = await axiosInstance.post(`/dashboard/employee/${id}`, fd);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/employee/${id}`);
    return res.data;
  },
};
