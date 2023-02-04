import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectCount = (state: RootReduxState) => state.progressCount;

export const selectProgressCount = createSelector(
  [selectCount],
  progressCount => progressCount.count,
);
