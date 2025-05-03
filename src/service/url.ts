export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const LOGIN = `${BASE_URL}auth/login`;
export const REGISTER = `${BASE_URL}auth/register`;
export const VERIFY_EMAIL = `${BASE_URL}auth/verify-email`;
export const FORGOT_PASSWORD = 'auth/forgot-password';
export const VERIFY_PASS_OTP = 'auth/verify-password-change';
export const CHANGE_PASS = 'auth/change-password';
export const RESEND_PASS_OTP = 'auth/resend-password-reset-otp';
export const RESEND_ACCOUNT_CREATION_OTP = `${BASE_URL}auth/resend-account-setup-otp`;
export const ACCOUNT_SETUP = `users/add-topics`;
export const GET_PROFILE = 'users/get-profile';
