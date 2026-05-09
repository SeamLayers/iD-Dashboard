import { axiosInstance, unwrap } from '../axios.instance';

export const publicService = {
  privacyPolicy: async (lang = 'en') => {
    const res = await axiosInstance.get('/privacy-policy', { params: { lang } });
    return unwrap(res);
  },

  termsConditions: async (lang = 'en') => {
    const res = await axiosInstance.get('/terms-conditions', { params: { lang } });
    return unwrap(res);
  },

  contactUs: async () => {
    const res = await axiosInstance.get('/contact-us');
    return unwrap(res);
  },

  globalConstants: async () => {
    const res = await axiosInstance.get('/global-constants');
    return unwrap(res);
  },
};
