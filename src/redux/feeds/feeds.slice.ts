import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  feedsCreate,
  feedsDelete,
  feedsUpdate,
} from 'src/redux/feeds/feeds.thunk';
import { feedsState } from 'src/types/feed.types';
import { LoadingState } from 'src/types/global.types';

const initialState: feedsState = {
  loading: null,
};

const feeds = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(feedsCreate.pending, feedsUpdate.pending, feedsDelete.pending),
        state => {
          state.loading = LoadingState.CREATE;
        },
      )
      .addMatcher(
        isAnyOf(
          feedsCreate.fulfilled,
          feedsUpdate.fulfilled,
          feedsDelete.fulfilled,
          feedsCreate.rejected,
          feedsUpdate.rejected,
          feedsDelete.rejected,
        ),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = feeds.actions;

export default feeds.reducer;
