import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { verifySubscriptionReceipt } from 'src/redux/subscription/subscription.thunk';
import { LoadingState } from 'src/types/global.types';
import { SubscriptionState } from 'src/types/subscription.types';

const initialState: SubscriptionState = {
  loading: null,
};

const subscription = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(verifySubscriptionReceipt.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(
        isAnyOf(
          verifySubscriptionReceipt.fulfilled,
          verifySubscriptionReceipt.rejected,
        ),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = subscription.actions;

export default subscription.reducer;
