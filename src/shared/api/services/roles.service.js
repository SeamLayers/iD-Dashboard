import { axiosInstance, unwrap } from '../axios.instance';

// The roles endpoint returns the full array (not paginated). The standard
// envelope wraps the array in `data`, so we unwrap the response into an array.
const unwrapList = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'success' in body && Array.isArray(body.data)) {
    return body.data;
  }
  if (Array.isArray(body)) {
    return body;
  }
  if (body && typeof body === 'object' && Array.isArray(body.data)) {
    return body.data;
  }
  return [];
};

export const rolesService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/roles', { params });
    return unwrapList(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/roles/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const res = await axiosInstance.post('/dashboard/roles', payload);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/dashboard/roles/${id}`, payload);
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/roles/${id}`);
    return res.data;
  },

  assignUsers: async (roleId, userIds) => {
    const res = await axiosInstance.post(`/dashboard/roles/${roleId}/users`, {
      user_ids: userIds,
    });
    return unwrap(res);
  },
};
