export type StorageItemProps = {
  myPocketId?: string;
  caseId?: string;
  url: string;
  fileName: string;
  fileType: string;
};
export type StorageDraftItemProps = {
  myPocketId?: string;
  caseId?: string;
  url?: string;
  fileName?: string;
  fileType?: string;
};

export type StorageProps = {
  all: StorageItemProps[];
  draft: StorageDraftItemProps[];
  size: string;
};

interface FromUserProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
export interface lstItemsProps {
  id: string;
  fromUser: FromUserProps;
  url: string;
  fileName: string;
  fileType: string;
}
export type PocketDataProps = {
  lst: lstItemsProps[];
  size: string;
};
export type CaseDataProps = {
  lst: lstItemsProps[];
  size: string;
};

export type StorageSharedDocsProps = {
  pocketData: PocketDataProps;
  caseData: CaseDataProps;
};

export type SelectedFilesProps = {
  myPocketId: string;
  caseId: string;
  fileType: string;
  fileName: string;
};
export type SelectedFilterLawyerProps = {
  state: string;
  city?: string;
  practiceArea?: string;
  caseFile?: boolean;
};

export interface SettingsStateProps {
  isDark: boolean;
  storage: StorageProps;
  sharedFiles: StorageSharedDocsProps;
  selectedFiles: SelectedFilesProps;
  selectedFilterLawyer: SelectedFilterLawyerProps;
  timer: number;
  currentCaseFileId: string;
  selectedLawyerLocation: string[];
  selectedCommanIssueId: number;
  selectedFeedId: number;
  isDraftPost: boolean;
  selectedCaseFileType: number;
}
