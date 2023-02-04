import { LoadingState } from 'src/types/global.types';

export interface notificationState {
  loading: LoadingState;
}

export interface NotificationProps {
  read: boolean;
  id: number;
  title: string;
  body: string;
  date: {
    updated: string;
  };
  fromUser: {
    id: number;
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}
