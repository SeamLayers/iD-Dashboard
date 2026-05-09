import { axiosInstance, unwrap, normalizePaginated } from '../axios.instance';

export const employeeProjectsService = {
  list: async (params = {}) => {
    const res = await axiosInstance.get('/dashboard/employee-project', { params });
    return normalizePaginated(res);
  },

  show: async (id) => {
    const res = await axiosInstance.get(`/dashboard/employee-project/${id}`);
    return unwrap(res);
  },

  create: async ({ employee_id, project_id }) => {
    const res = await axiosInstance.post('/dashboard/employee-project', {
      employee_id,
      project_id,
    });
    return unwrap(res);
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/dashboard/employee-project/${id}`);
    return res.data;
  },
};
