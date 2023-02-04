import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { blockUser, unBlockUser } from 'src/redux/blockUser/blockUser.thunk';
import { BlockUser } from 'src/types/blockUser.types';
import { LoadingState } from 'src/types/global.types';

const initialState: BlockUser = {
  loading: null,
};

const blockedUser = createSlice({
  name: 'blockUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(unBlockUser.pending, blockUser.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(
        isAnyOf(
          blockUser.fulfilled,
          blockUser.rejected,
          unBlockUser.fulfilled,
          unBlockUser.rejected,
        ),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = blockedUser.actions;

export default blockedUser.reducer;
