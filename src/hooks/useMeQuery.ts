import { QueryKey, useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';

import { fetch } from 'src/redux/fetch';
import { CurrentUser } from 'src/types/user.types';

export const useMeQuery = (
  options?: UseQueryOptions<CurrentUser, unknown, CurrentUser, QueryKey>,
) => {
  return useQuery<CurrentUser>(
    QueryKeys.ME,
    async () => {
      const { data, errors, statusCode } = await fetch<CurrentUser>({
        url: API.ME,
        method: 'GET',
      });

      if (errors) {
        if (statusCode === 401) {
          return null;
        }
        throw new Error(errors.message);
      }

      return data;
    },
    options,
  );
};
