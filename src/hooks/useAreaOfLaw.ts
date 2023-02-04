import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { GetAreaOfLawProps } from 'src/types/setProfile.types';

export const useAreaOfLaw = (
  options?: UseQueryOptions<
    GetAreaOfLawProps[],
    unknown,
    GetAreaOfLawProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.AREA_OF_LAW],
    async () => {
      const { data, errors } = await fetch<GetAreaOfLawProps[]>({
        url: API.GET_AREA_OF_LAW,
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
