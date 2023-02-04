import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectCaseFileState = (state: RootReduxState) => state.caseFile;

export const selectCaseFileLoading = createSelector(
  [selectCaseFileState],
  caseFile => caseFile.loading,
);
