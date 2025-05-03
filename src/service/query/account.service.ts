import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../querykey';
import { addTopics, getProfile } from '../api/account.service';

export const useAddTopics = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: addTopics,
    mutationKey: [QUERY_KEYS.ACCOUNT_SETUP],
    ...options,
  });
  return { mutate, isPending };
};

export const useGetProfile = (options = {}) => {
  const { data, isPending, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILE],
    queryFn: getProfile,
    ...options,
  });

  return { data, isPending, ...rest };
};
