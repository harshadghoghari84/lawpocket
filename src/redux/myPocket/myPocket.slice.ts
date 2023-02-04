import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { myPocket } from 'src/redux/myPocket/myPocket.thunk';
import { LoadingState } from 'src/types/global.types';
import { MyPocketState } from 'src/types/myPocket.types';

const initialState: MyPocketState = {
  loading: null,
};

const myPocketAction = createSlice({
  name: 'myPocket',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(myPocket.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(isAnyOf(myPocket.fulfilled, myPocket.rejected), state => {
        state.loading = null;
      });
  },
});

export const {} = myPocketAction.actions;

export default myPocketAction.reducer;
