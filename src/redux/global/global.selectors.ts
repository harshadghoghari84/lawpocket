import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectGlobalState = (state: RootReduxState) => state.global;

export const selectGlobalErrors = createSelector(
  [selectGlobalState],
  ({ errors, errorMessage }) => ({ errors, errorMessage }),
);

export const selectGlobalSuccess = createSelector(
  [selectGlobalState],
  ({ success, successMessage }) => ({ success, successMessage }),
);
