import axios from 'axios';
import * as API from '../url';
import axiosInstance from '../axiosInstance';
import {
  LoginSchemaType,
  ForgotPasswordSchemaType,
  RegisterStepTwoSchemaType,
} from '@/utils/validation';
import {
  ChangePasswordBody,
  ResendOtpBody,
  VerifyPasswordChange,
} from '@/types/auth';

export const login = async (body: LoginSchemaType) => {
  const res = await axios.post(API.LOGIN, body);
  return res.data;
};

export const register = async (body: RegisterStepTwoSchemaType) => {
  const res = await axios.post(API.REGISTER, body);
  return res.data;
};

export const verifyEmail = async (body: VerifyPasswordChange) => {
  const res = await axios.patch(API.VERIFY_EMAIL, body);
  return res.data;
};

export const forgotPassword = async (body: ForgotPasswordSchemaType) => {
  const res = await axiosInstance.patch(API.FORGOT_PASSWORD, body);
  return res.data;
};

export const verifyPasswordOtp = async (body: VerifyPasswordChange) => {
  const res = await axiosInstance.patch(API.VERIFY_PASS_OTP, body);
  return res.data;
};

export const changePassword = async (body: ChangePasswordBody) => {
  const res = await axiosInstance.patch(API.CHANGE_PASS, body);
  return res.data;
};

export const resendPasswordOtp = async (body: ResendOtpBody) => {
  const res = await axiosInstance.patch(API.RESEND_PASS_OTP, body);
  return res.data;
};

export const resendAccountCreationOtp = async (body: ResendOtpBody) => {
  const res = await axios.patch(API.RESEND_ACCOUNT_CREATION_OTP, body);
  return res.data;
};
