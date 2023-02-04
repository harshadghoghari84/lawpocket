import { LoadingState } from 'src/types/global.types';
import { CurrentUser } from 'src/types/user.types';

export interface caseFileState {
  loading: LoadingState;
}

export interface CaseFileDocumentProps {
  size: string;
  location: string;
  mimetype: string;
  uri: string;
  name: string;
}

export interface CaseFileProps {
  id: number;
  caseFileType: number;
  state: string;
  city: string;
  caseTitle: string;
  customName: string;
  documents: CaseFileDocumentProps[];
  pdf: string;
  user: CurrentUser;
}
