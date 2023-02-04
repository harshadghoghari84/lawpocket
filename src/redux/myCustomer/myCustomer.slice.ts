import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { LoadingState } from 'src/types/global.types';
import { MyCustomer } from 'src/types/myCustomer.types';
import { markAsClient } from 'src/redux/myCustomer/myCustomer.thunk';
const initialState: MyCustomer = {
  loading: null,
};

const myCustomer = createSlice({
  name: 'myCustomer',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(markAsClient.pending, markAsClient.pending),
        state => {
          state.loading = LoadingState.CREATE;
        },
      )
      .addMatcher(
        isAnyOf(markAsClient.fulfilled, markAsClient.rejected),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = myCustomer.actions;

export default myCustomer.reducer;
