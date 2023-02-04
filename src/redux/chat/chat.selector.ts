import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectChatState = (state: RootReduxState) => state.chat;

export const selectLawyerLoading = createSelector(
  [selectChatState],
  chat => chat.loading,
);
