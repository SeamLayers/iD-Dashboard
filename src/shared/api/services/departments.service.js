import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

export const departmentsService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/department', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/department/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const res = await axiosInstance.post('/dashboard/department', payload);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/dashboard/department/${id}`, payload);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/department/${id}`);
    return res.data;
  },
};
