import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';

/**
 * Auth mutation hooks.
 *
 * Note: login/logout still flow through `AuthProvider` (which owns the
 * session state). These wrappers cover the side-effect-only auth endpoints
 * — register (admin creates users), password reset, phone OTP — so callers
 * get React Query's status flags (`isPending`, `isError`, `error`, etc.)
 * without rebuilding manual loading/error state.
 */

/** Admin creates a new user. Requires superadmin or owner role. */
export const useRegisterUser = () =>
  useMutation({
    mutationFn: (payload) => authService.register(payload),
  });

/** Forgot password — sends a 6-digit OTP via email. */
export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });

/** Reset password using the email OTP. */
export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload) => authService.resetPassword(payload),
  });

/** Phone OTP — send. Surfaces 429 (rate-limited) via the error object. */
export const useSendPhoneOtp = () =>
  useMutation({
    mutationFn: (payload) => authService.sendPhoneOtp(payload),
  });

/** Phone OTP — verify. */
export const useVerifyPhoneOtp = () =>
  useMutation({
    mutationFn: (payload) => authService.verifyPhoneOtp(payload),
  });
