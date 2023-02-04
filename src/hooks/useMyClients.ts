import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { MyCustomersProps } from 'src/types/myCustomer.types';

export const useMyClients = (
  options?: UseQueryOptions<
    MyCustomersProps[],
    unknown,
    MyCustomersProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.MY_CLIENTS],
    async () => {
      const { data, errors } = await fetch<MyCustomersProps[]>({
        url: API.MY_CLIENTS_LIST,
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
