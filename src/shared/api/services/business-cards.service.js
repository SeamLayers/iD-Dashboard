import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

export const businessCardsService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/business-cards', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/business-cards/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const res = await axiosInstance.post('/dashboard/business-cards', payload);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/dashboard/business-cards/${id}`, payload);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/business-cards/${id}`);
    return res.data;
  },

  submit: async (id) => {
    const res = await axiosInstance.post(`/dashboard/business-cards/${id}/submit`);
    return unwrap(res);
  },

  publish: async (id) => {
    const res = await axiosInstance.post(`/dashboard/business-cards/${id}/publish`);
    return unwrap(res);
  },

  deactivate: async (id) => {
    const res = await axiosInstance.post(`/dashboard/business-cards/${id}/deactivate`);
    return unwrap(res);
  },

  // Review actions live under the mobile-scoped routes (role:superadmin|employee
  // + business_card.approve/reject). Superadmins reviewing from the dashboard
  // hit the same endpoints.
  approve: async (id) => {
    const res = await axiosInstance.post(`/mobile/business-cards/${id}/approve`);
    return unwrap(res);
  },

  reject: async (id, rejection_reason) => {
    const res = await axiosInstance.post(`/mobile/business-cards/${id}/reject`, { rejection_reason });
    return unwrap(res);
  },

  track: async (id, body = {}) => {
    const res = await axiosInstance.post(`/dashboard/business-cards/${id}/track`, body);
    return res.data;
  },

  analytics: async (id) => {
    const res = await axiosInstance.post(`/dashboard/business-cards/${id}/analytics`);
    return unwrap(res);
  },
};
