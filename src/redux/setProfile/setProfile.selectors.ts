import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectSetProfileState = (state: RootReduxState) => state.setProfile;

export const selectSetProfileLoading = createSelector(
  [selectSetProfileState],
  setProfile => setProfile.loading,
);
