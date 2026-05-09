import { axiosInstance } from '../axios.instance';

export const notificationsService = {
  list: async () => {
    const res = await axiosInstance.get('/notifications');
    const body = res.data;
    if (Array.isArray(body)) return body;
    if (body && typeof body === 'object') {
      if (Array.isArray(body.data)) return body.data;
      if (body.data && typeof body.data === 'object' && Array.isArray(body.data.data)) {
        return body.data.data;
      }
    }
    return [];
  },

  markAsRead: async (id) => {
    const res = await axiosInstance.post(`/notifications/${id}/read`);
    return res.data;
  },
};
