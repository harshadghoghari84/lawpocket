import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { feedsByIdProps, feedsProps } from 'src/types/feed.types';

export const useFeeds = (
  options?: UseQueryOptions<feedsProps[], unknown, feedsProps[], string[]>,
) => {
  return useQuery(
    [QueryKeys.FEEDS],
    async () => {
      const { data, errors } = await fetch<feedsProps[]>({
        url: API.GET_LIST_FEEDS,
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
export const useFeedsBySearch = (
  isDraft?: boolean,
  searchText?: string,
  options?: UseQueryOptions<feedsProps[], unknown, feedsProps[], string[]>,
) => {
  return useQuery(
    [QueryKeys.FEEDS_SEARCH, searchText],
    async () => {
      console.log('searchText', searchText);
      console.log('isDraft', isDraft);
      const { data, errors } = await fetch<feedsProps[]>({
        url: API.GET_LIST_FEEDS,
        method: 'GET',
        params: {
          ...(isDraft && {
            isDraft,
          }),
          ...(searchText && {
            searchText,
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
export const useMyFeeds = (
  isUser?: boolean,
  // isDraft?: boolean,
  options?: UseQueryOptions<feedsProps[], unknown, feedsProps[], string[]>,
) => {
  return useQuery(
    [QueryKeys.MY_FEEDS],
    async () => {
      const { data, errors } = await fetch<feedsProps[]>({
        url: API.GET_LIST_FEEDS,
        method: 'GET',
        params: {
          // ...(isDraft && {
          //   isDraft,
          // }),
          ...(isUser && {
            isUser,
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

export const useFeedById = (
  id?: number,
  options?: UseQueryOptions<feedsByIdProps, unknown, feedsByIdProps, string[]>,
) => {
  return useQuery(
    [QueryKeys.FEEDS_BY_ID],
    async () => {
      const { data, errors } = await fetch<feedsByIdProps>({
        url: `${API.GET_LIST_FEEDS}/${id}`,
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
