import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { ChatListProps } from 'src/types/chat.types';

export const useActiveChats = (
  isClosed: boolean,
  limit: string,
  page: string,
  options?: UseQueryOptions<ChatListProps, unknown, ChatListProps, string[]>,
) => {
  return useQuery(
    [QueryKeys.ACTIVE_CHATS],
    async () => {
      const { data, errors } = await fetch<ChatListProps>({
        url: API.CHATS_LIST,
        method: 'GET',
        params: {
          isClosed: isClosed,
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
export const useInActiveChats = (
  isClosed: boolean,
  limit: string,
  page: string,
  options?: UseQueryOptions<ChatListProps, unknown, ChatListProps, string[]>,
) => {
  return useQuery(
    [QueryKeys.IN_ACTIVE_CHATS],
    async () => {
      const { data, errors } = await fetch<ChatListProps>({
        url: API.CHATS_LIST,
        method: 'GET',
        params: {
          isClosed: isClosed,
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
