import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { notificationRead } from 'src/redux/notification/notification.thunk';
import { LoadingState } from 'src/types/global.types';
import { notificationState } from 'src/types/notification.types';

const initialState: notificationState = {
  loading: null,
};

const notificationAction = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(notificationRead.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(
        isAnyOf(notificationRead.fulfilled, notificationRead.rejected),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = notificationAction.actions;

export default notificationAction.reducer;
