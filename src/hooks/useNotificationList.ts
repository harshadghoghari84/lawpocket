import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { NotificationProps } from 'src/types/notification.types';

export const useNotification = (
  limit: string,
  page: string,
  options?: UseQueryOptions<
    NotificationProps[],
    unknown,
    NotificationProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.NOTIFICATION],
    async () => {
      const { data, errors } = await fetch<NotificationProps[]>({
        url: API.NOTIFICATION_LIST,
        method: 'GET',
        params: {
          limit: limit,
          page: page,
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
