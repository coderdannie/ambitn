import * as API from '../url';
import axiosInstance from '../axiosInstance';

interface Topics {
  topics: string[];
}
export const addTopics = async (body: Topics) => {
  const res = await axiosInstance.post(API.ACCOUNT_SETUP, body);
  return res.data;
};
