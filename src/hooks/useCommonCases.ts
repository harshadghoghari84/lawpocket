import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { GetCommonCasesProps } from 'src/types/setProfile.types';

export const useCommonCases = (
  options?: UseQueryOptions<
    GetCommonCasesProps[],
    unknown,
    GetCommonCasesProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.COMMON_CASES],
    async () => {
      const { data, errors } = await fetch<GetCommonCasesProps[]>({
        url: API.GET_COMMON_CASES,
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
