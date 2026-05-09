import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

export const branchesService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/company-branch', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/company-branch/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const res = await axiosInstance.post('/dashboard/company-branch', payload);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/dashboard/company-branch/${id}`, payload);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/company-branch/${id}`);
    return res.data;
  },
};
