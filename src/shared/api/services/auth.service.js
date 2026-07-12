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

  /**
   * Create a new platform user.
   *
   * The backend (StoreUserRequest + RegisteredUserController) now generates
   * a one-time random password server-side, stamps an `expire_password` 48h
   * in the future, and returns it in the response so the creator can hand
   * it over to the new user. We therefore no longer send `password` —
   * only the four fields the backend accepts: name, email, phone, user_type.
   */
  register: async ({ name, email, phone, user_type }) => {
    const res = await axiosInstance.post('/dashboard/register', {
      name,
      email,
      phone,
      user_type,
    });
    return unwrap(res);
  },

  // Authenticated password change — used by the forced first-login reset
  // (temp password → own password) and the normal change action. Does not use
  // the OTP flow.
  changePassword: async ({ current_password, password, password_confirmation }) => {
    const res = await axiosInstance.post('/auth/change-password', {
      current_password,
      password,
      password_confirmation,
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
