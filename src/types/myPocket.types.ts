import { LoadingState } from 'src/types/global.types';
import { CurrentUser } from 'src/types/user.types';

export interface MyPocketState {
  loading: LoadingState;
}

export interface GetDocumentFromIDProps {
  id: number;
  caseFileType?: number;
  state?: string;
  city?: string;
  caseTitle?: string;
  customName?: string;
  documents: string;
  pdf?: string;
  date: {
    created: string;
    updated: string;
  };
  user: CurrentUser;
}
