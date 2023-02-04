import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectFeedsState = (state: RootReduxState) => state.feeds;

export const selectFeedsLoading = createSelector(
  [selectFeedsState],
  feeds => feeds.loading,
);
