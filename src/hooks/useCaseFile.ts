import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { CaseFileProps } from 'src/types/caseFile.types';

export const useCaseFile = (
  id: string,
  options?: UseQueryOptions<CaseFileProps, unknown, CaseFileProps, string[]>,
) => {
  return useQuery(
    [QueryKeys.AREA_OF_LAW, id],
    async () => {
      const { data, errors } = await fetch<CaseFileProps>({
        url: `${API.GET_CASE_FILE_BY_ID}/${id}`,
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
