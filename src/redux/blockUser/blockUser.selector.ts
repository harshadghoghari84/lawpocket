import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectBlockUserState = (state: RootReduxState) => state.blockUser;

export const selectBlockUserLoading = createSelector(
  [selectBlockUserState],
  blockUser => blockUser.loading,
);
