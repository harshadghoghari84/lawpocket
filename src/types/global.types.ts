import { FetchResponseError } from 'src/types/fetch.types';
import { EdgeInsets } from 'react-native-safe-area-context';

export interface GlobalState {
  errors: FetchResponseError;
  errorMessage: string | null;

  success: boolean;
  successMessage: string;
}

export enum LoadingState {
  FETCH = 1,
  CREATE,
  REMOVE,
}

export type ThemeProps = { insets: EdgeInsets };
