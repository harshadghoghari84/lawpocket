import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  createCaseFile,
  updateCaseFile,
} from 'src/redux/caseFile/caseFile.thunk';
import { caseFileState } from 'src/types/caseFile.types';
import { LoadingState } from 'src/types/global.types';

const initialState: caseFileState = {
  loading: null,
};

const caseFile = createSlice({
  name: 'caseFile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(createCaseFile.pending, updateCaseFile.pending),
        state => {
          state.loading = LoadingState.CREATE;
        },
      )
      .addMatcher(
        isAnyOf(
          createCaseFile.fulfilled,
          updateCaseFile.fulfilled,
          createCaseFile.rejected,
          updateCaseFile.rejected,
        ),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = caseFile.actions;

export default caseFile.reducer;
