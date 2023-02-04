import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { DashBoardList } from 'src/types/common.types';

export const useDashBoardList = (
  options?: UseQueryOptions<DashBoardList, unknown, DashBoardList, string[]>,
) => {
  return useQuery(
    [QueryKeys.DASHBOARD_LIST],
    async () => {
      const { data, errors } = await fetch<DashBoardList>({
        url: API.DASHBOARD_LIST,
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
