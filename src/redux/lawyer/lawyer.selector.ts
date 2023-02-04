import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectLawyerState = (state: RootReduxState) => state.lawyer;

export const selectLawyerLoading = createSelector(
  [selectLawyerState],
  lawyer => lawyer.loading,
);
