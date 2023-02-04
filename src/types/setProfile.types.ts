import { LoadingState } from 'src/types/global.types';

export interface setProfileState {
  loading: LoadingState;
}

export type MessagePayload = {
  message: string;
};

export interface emailUpdateProps {
  email: string;
}

export interface GetAreaOfLawProps {
  id: number;
  label: string;
}
export interface GetCommonCasesProps {
  id: number;
  title: string;
  date: { created: string; updated: string };
}

export interface State {
  name: string;
  countryCode: string;
  fipsCode: string;
  iso: string;
  latitude: string;
  longitude: string;
}
export interface City {
  name: string;
  latitude: string;
  longitude: string;
}
