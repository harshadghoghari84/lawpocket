import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectNotification = (state: RootReduxState) => state.notification;

export const selectNotificationLoading = createSelector(
  [selectNotification],
  notification => notification.loading,
);
