import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { GetSubscriptionProps } from 'src/types/subscription.types';

export const useSubscription = (
  options?: UseQueryOptions<
    GetSubscriptionProps[],
    unknown,
    GetSubscriptionProps[],
    string[]
  >,
) => {
  return useQuery(
    [QueryKeys.SUBSCRIPTION_LIST],
    async () => {
      const { data, errors } = await fetch<GetSubscriptionProps[]>({
        url: API.GET_SUBSCRIPTION,
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
