import * as API from '../url';
import axiosInstance from '../axiosInstance';
import { ProfileResponse } from '@/types/account';

interface Topics {
  topics: string[];
}
export const addTopics = async (body: Topics) => {
  const res = await axiosInstance.post(API.ACCOUNT_SETUP, body);
  return res.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await axiosInstance.get<ProfileResponse>(`${API.GET_PROFILE}`);
  return res.data;
};
