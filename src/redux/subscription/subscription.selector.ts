import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectSubscriptionState = (state: RootReduxState) => state.subscription;

export const selectSubscriptionLoading = createSelector(
  [selectSubscriptionState],
  subscription => subscription.loading,
);
