export default {
  setProfile: 'Set your profile',
  albumName: 'law-pocket',
  caseFile: 'Case File',
  chatCount: 'chatCount',
};

export enum UserType {
  CLIENT = 1,
  LAW_STUDENT = 2,
  ATTORNEY = 3,
  LAW_FIRM = 4,
  LEGAL_SERVICE_PROVIDER = 5,
}

export enum CaseFileType {
  NEED_ANOTHER_LAWYER = 1,
  ISSUE_SOLVED = 2,
  USER_BREAKS_THE_RULES = 3,
}
export enum CaseFileIssueType {
  CIVIL = 1,
  CRIMINAL = 2,
  I_DONT_KNOW = 3,
}

export enum SetupProfileStatus {
  PENDING = 1,
  VERIFY = 2,
  REJECT = 3,
}

export const USER_COLLECTION = 'Users';
export const MESSAGE_COLLECTION = 'messages';
