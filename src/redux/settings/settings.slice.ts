import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SelectedFilesProps,
  SelectedFilterLawyerProps,
  SettingsStateProps,
  StorageProps,
  StorageSharedDocsProps,
} from 'src/types/settings.types';

const initialState: SettingsStateProps = {
  isDark: true,
  storage: {
    all: [],
    draft: [],
    size: '',
  },
  sharedFiles: {
    pocketData: { lst: [], size: '' },
    caseData: { lst: [], size: '' },
  },
  selectedFiles: { myPocketId: '', caseId: '', fileType: '', fileName: '' },
  timer: 0,
  selectedFilterLawyer: {
    state: '',
    city: '',
    practiceArea: '',
    caseFile: null,
  },
  currentCaseFileId: '',
  selectedLawyerLocation: [],
  selectedCommanIssueId: null,
  selectedFeedId: null,
  isDraftPost: false,
  selectedCaseFileType: null,
};

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    isDarkMode: (
      state: SettingsStateProps,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isDark = payload;
    },
    storage: (
      state: SettingsStateProps,
      { payload }: PayloadAction<StorageProps>,
    ) => {
      state.storage = payload;
    },
    sharedFiles: (
      state: SettingsStateProps,
      { payload }: PayloadAction<StorageSharedDocsProps>,
    ) => {
      state.sharedFiles = payload;
    },
    selectedFiles: (
      state: SettingsStateProps,
      { payload }: PayloadAction<SelectedFilesProps>,
    ) => {
      state.selectedFiles = payload;
    },
    selectedFilterLawyer: (
      state: SettingsStateProps,
      { payload }: PayloadAction<SelectedFilterLawyerProps>,
    ) => {
      state.selectedFilterLawyer = payload;
    },
    setSelectCommanIssueId: (
      state: SettingsStateProps,
      { payload }: PayloadAction<number>,
    ) => {
      state.selectedCommanIssueId = payload;
    },
    setSelectedFeedId: (
      state: SettingsStateProps,
      { payload }: PayloadAction<number>,
    ) => {
      state.selectedFeedId = payload;
    },
    setIsDraftPost: (
      state: SettingsStateProps,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isDraftPost = payload;
    },
    setTimer: (
      state: SettingsStateProps,
      { payload }: PayloadAction<number>,
    ) => {
      state.timer = state.timer + payload;
    },
    setCurrentCaseFileId: (
      state: SettingsStateProps,
      { payload }: PayloadAction<string>,
    ) => {
      state.currentCaseFileId = payload;
    },
    setSelectedCaseFileType: (
      state: SettingsStateProps,
      { payload }: PayloadAction<number>,
    ) => {
      state.selectedCaseFileType = payload;
    },
    setLawyerLocation: (
      state: SettingsStateProps,
      { payload }: PayloadAction<string[]>,
    ) => {
      state.selectedLawyerLocation = payload;
    },
  },
});

export const {
  isDarkMode,
  storage,
  selectedFiles,
  selectedFilterLawyer,
  sharedFiles,
  setTimer,
  setCurrentCaseFileId,
  setSelectCommanIssueId,
  setLawyerLocation,
  setSelectedFeedId,
  setIsDraftPost,
  setSelectedCaseFileType,
} = settings.actions;

export default settings.reducer;
