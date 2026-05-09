import { axiosInstance, unwrap } from '../axios.instance';

export const authService = {
  login: async ({ email, password, device_token = 'web-dashboard' }) => {
    const res = await axiosInstance.post('/auth/login', { email, password, device_token });
    return unwrap(res);
  },

  logout: async () => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },

  register: async ({ name, email, password, password_confirmation, user_type }) => {
    const res = await axiosInstance.post('/dashboard/register', {
      name,
      email,
      password,
      password_confirmation,
      user_type,
    });
    return unwrap(res);
  },

  forgotPassword: async (email) => {
    const res = await axiosInstance.post('/auth/forgot-password', { email });
    return unwrap(res);
  },

  resetPassword: async ({ email, otp, password, password_confirmation }) => {
    const res = await axiosInstance.post('/auth/reset-password', {
      email,
      otp,
      password,
      password_confirmation,
    });
    return unwrap(res);
  },

  sendPhoneOtp: async ({ country_code, phone }) => {
    const res = await axiosInstance.post('/auth/send-otp', { country_code, phone });
    return unwrap(res);
  },

  verifyPhoneOtp: async ({ country_code, phone, otp }) => {
    const res = await axiosInstance.post('/auth/verify-otp', { country_code, phone, otp });
    return res.data;
  },
};
