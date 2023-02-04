import { QueryKey, useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { CurrentUser } from 'src/types/user.types';

export const useUserById = (
  id: number,
  options?: UseQueryOptions<CurrentUser, unknown, CurrentUser, QueryKey>,
) => {
  return useQuery<CurrentUser>(
    [QueryKeys.ME, id],
    async () => {
      const { data, errors } = await fetch<CurrentUser>({
        url: `${API.GET_USER_BY_ID}/${id}`,
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
