import { QueryKey, useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { StorageProps } from 'src/types/settings.types';

export const useMyPocket = (
  options?: UseQueryOptions<StorageProps, unknown, StorageProps, QueryKey>,
) => {
  return useQuery<StorageProps>(
    QueryKeys.MY_POCKET,
    async () => {
      const { data, errors } = await fetch<StorageProps>({
        url: API.MY_POCKET,
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
