import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectUpdateProfileState = (state: RootReduxState) => state.updateProfile;

export const selectSetProfileLoading = createSelector(
  [selectUpdateProfileState],
  updateProfile => updateProfile.loading,
);
