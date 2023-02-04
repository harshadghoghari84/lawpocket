import { createSelector } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';

const selectSettings = (state: RootReduxState) => state.settings;

export const isDark = createSelector(
  [selectSettings],
  settings => settings.isDark,
);

export const selectStorage = createSelector(
  [selectSettings],
  settings => settings.storage,
);
export const selectSharedFiles = createSelector(
  [selectSettings],
  settings => settings.sharedFiles,
);
export const selectFiles = createSelector(
  [selectSettings],
  settings => settings.selectedFiles,
);
export const selectFilterLawyer = createSelector(
  [selectSettings],
  settings => settings.selectedFilterLawyer,
);
export const timerSelector = createSelector(
  [selectSettings],
  settings => settings.timer,
);
export const caseFileSelector = createSelector(
  [selectSettings],
  settings => settings.currentCaseFileId,
);
export const commanCaseFileId = createSelector(
  [selectSettings],
  settings => settings.selectedCommanIssueId,
);
export const caseFileType = createSelector(
  [selectSettings],
  settings => settings.selectedCaseFileType,
);
export const feedSelector = createSelector(
  [selectSettings],
  settings => settings.selectedFeedId,
);
export const isDraftPostSelector = createSelector(
  [selectSettings],
  settings => settings.isDraftPost,
);

export const selectedLawyerLocation = createSelector(
  [selectSettings],
  settings => settings.selectedLawyerLocation,
);
