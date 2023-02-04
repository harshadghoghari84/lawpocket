import { QueryKey, useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { StorageSharedDocsProps } from 'src/types/settings.types';

export const useAllSharedFiles = (
  options?: UseQueryOptions<
    StorageSharedDocsProps,
    unknown,
    StorageSharedDocsProps,
    QueryKey
  >,
) => {
  return useQuery<StorageSharedDocsProps>(
    QueryKeys.MY_POCKET_SHARED_FILE,
    async () => {
      const { data, errors } = await fetch<StorageSharedDocsProps>({
        url: API.All_SHARED_FILE,
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
