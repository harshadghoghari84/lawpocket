import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectMyCustomerState = (state: RootReduxState) => state.myCustomer;

export const selectMyCustomerLoading = createSelector(
  [selectMyCustomerState],
  myCustomer => myCustomer.loading,
);
