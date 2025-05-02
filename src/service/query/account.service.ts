import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '../querykey';
import { addTopics } from '../api/account.service';

export const useAddTopics = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: addTopics,
    mutationKey: [QUERY_KEYS.ACCOUNT_SETUP],
    ...options,
  });
  return { mutate, isPending };
};
