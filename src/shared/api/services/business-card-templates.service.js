import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

export const businessCardTemplatesService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/business-cards-templates', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/business-cards-templates/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const res = await axiosInstance.post('/dashboard/business-cards-templates', payload);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/dashboard/business-cards-templates/${id}`, payload);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/business-cards-templates/${id}`);
    return res.data;
  },
};
