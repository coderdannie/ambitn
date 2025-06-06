import * as API from '../url';
import axiosInstance from '../axiosInstance';
import { ProfileResponse } from '@/types/account';

export const addTopics = async (body: string[]) => {
  const res = await axiosInstance.post(API.ACCOUNT_SETUP, body);
  return res.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await axiosInstance.get<ProfileResponse>(`${API.GET_PROFILE}`);
  return res.data;
};
