import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgressCountState } from 'src/types/common.types';

const initialState: ProgressCountState = {
  count: 20,
};

const counts = createSlice({
  name: 'counts',
  initialState,
  reducers: {
    addCount: (
      state: ProgressCountState,
      { payload }: PayloadAction<number>,
    ) => {
      state.count = payload;
    },
  },
});

export const { addCount } = counts.actions;

export default counts.reducer;
