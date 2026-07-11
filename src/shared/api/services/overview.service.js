import { axiosInstance, unwrap } from '../axios.instance';

export const overviewService = {
  get: async () => {
    const res = await axiosInstance.get('/dashboard/overview');
    return unwrap(res);
  },
};
