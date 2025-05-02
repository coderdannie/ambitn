import { useMutation } from '@tanstack/react-query';
import {
  forgotPassword,
  login,
  register,
  changePassword,
  verifyEmail,
  verifyPasswordOtp,
  resendPasswordOtp,
  resendAccountCreationOtp,
} from '../api/auth.service';
import { QUERY_KEYS } from '../querykey';

export const useLogin = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    mutationKey: [QUERY_KEYS.LOGIN],
    ...options,
  });
  return { mutate, isPending };
};

export const useSignUp = (options = {}) => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: register,
    mutationKey: [QUERY_KEYS.SIGN_UP],
    ...options,
  });
  return { mutate, isPending, data };
};

export const useVerifyEmail = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmail,
    mutationKey: [QUERY_KEYS.VERIFY_EMAIL],
    ...options,
  });
  return { mutate, isPending };
};

export const useForgotPassword = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    mutationKey: [QUERY_KEYS.FORGOT_PASSWORD],
    ...options,
  });
  return { mutate, isPending };
};

export const useVerifyPasswordOtp = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: verifyPasswordOtp,
    mutationKey: [QUERY_KEYS.VERIFY_PASSWORD_OTP],
    ...options,
  });
  return { mutate, isPending };
};

export const useChangePassword = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    mutationKey: [QUERY_KEYS.CHANGE_PASSWORD],
    ...options,
  });
  return { mutate, isPending };
};

export const useResendPasswordOtp = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: resendPasswordOtp,
    mutationKey: [QUERY_KEYS.RESEND_PASSWORD_OTP],
    ...options,
  });
  return { mutate, isPending };
};

export const useResendAccountCreationOtp = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: resendAccountCreationOtp,
    mutationKey: [QUERY_KEYS.RESEND_ACCOUNT_CREATION_OTP],
    ...options,
  });
  return { mutate, isPending };
};
