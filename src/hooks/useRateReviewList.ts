import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { GetRateReview } from 'src/types/reviewrate.types';

export const useRateReview = (
  options?: UseQueryOptions<GetRateReview, unknown, GetRateReview, string[]>,
) => {
  return useQuery(
    [QueryKeys.REVIEW_RATE_LIST],
    async () => {
      const { data, errors } = await fetch<GetRateReview>({
        url: API.RATE_REVIEW,
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

export const useRateReviewById = (
  userId: string,
  limit: string,
  page: string,
  options?: UseQueryOptions<GetRateReview, unknown, GetRateReview, string[]>,
) => {
  const queryKey = [QueryKeys.REVIEW_RATE_LIST_BY_ID, userId, limit, page];
  return useQuery(
    queryKey,
    async () => {
      const { data, errors } = await fetch<GetRateReview>({
        url: userId ? API.RATE_REVIEW_BY_ID : API.RATE_REVIEW,
        method: 'GET',
        params: {
          ...(userId && {
            userId,
          }),
          ...(userId && { limit: limit }),
          ...(userId && { page: page }),
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
