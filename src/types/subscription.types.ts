import { LoadingState } from 'src/types/global.types';

export interface SubscriptionState {
  loading: LoadingState;
}

export interface GetSubscriptionProps {
  id: number;
  title: string;
  description: string;
  product: string;
  type: number;
  gbStorage: number;
  loginCount: number;
  attorneyCount: number;
  date: {
    created: string;
    updated: string;
  };
}
