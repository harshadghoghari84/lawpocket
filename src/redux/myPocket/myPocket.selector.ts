import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectMyPocketState = (state: RootReduxState) => state.myPocket;

export const selectMyPocketLoading = createSelector(
  [selectMyPocketState],
  myPocket => myPocket.loading,
);
