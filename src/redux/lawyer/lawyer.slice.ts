import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { rateReview } from 'src/redux/lawyer/lawyer.thunk';
import { LoadingState } from 'src/types/global.types';
import { lawyerState } from 'src/types/lawyer.types';

const initialState: lawyerState = {
  loading: null,
};

const lawyers = createSlice({
  name: 'lawyer',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(rateReview.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(isAnyOf(rateReview.fulfilled, rateReview.rejected), state => {
        state.loading = null;
      });
  },
});

export const {} = lawyers.actions;

export default lawyers.reducer;
