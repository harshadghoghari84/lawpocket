import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { GetLawyersProps } from 'src/types/lawyers.types';

export const useLawyers = (
  state: string,
  city: string,
  practiceArea: string,
  caseFile: boolean,
  options?: UseQueryOptions<
    GetLawyersProps[],
    unknown,
    GetLawyersProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.LAWYERS, state, city, practiceArea],
    async () => {
      const { data, errors } = await fetch<GetLawyersProps[]>({
        url: API.LAWYERS_LIST,
        method: 'GET',
        params: {
          ...(practiceArea && {
            practiceArea,
          }),
          ...(state && {
            state,
          }),
          ...(city && {
            city,
          }),
          ...(caseFile && {
            caseFile,
          }),
        },
      });

      if (errors) {
        throw new Error(errors.message);
      }

      return data;
    },
    options,
  );
};
