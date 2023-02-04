import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { BlockedUserItemProps } from 'src/types/blockUser.types';

export const useBlockedUsers = (
  options?: UseQueryOptions<
    BlockedUserItemProps[],
    unknown,
    BlockedUserItemProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.Blocked_USERS_LIST],
    async () => {
      const { data, errors } = await fetch<BlockedUserItemProps[]>({
        url: API.BLOCKED_USER_LIST,
        method: 'GET',
      });

      if (errors) {
        throw new Error(errors.message);
      }

      return data;
    },
    options,
  );
};
