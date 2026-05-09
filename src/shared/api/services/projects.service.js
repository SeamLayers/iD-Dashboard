import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

export const projectsService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/project', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/project/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const res = await axiosInstance.post('/dashboard/project', payload);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/dashboard/project/${id}`, payload);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/project/${id}`);
    return res.data;
  },
};
