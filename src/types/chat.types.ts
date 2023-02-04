import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { LoadingState } from 'src/types/global.types';

export interface chatState {
  loading: LoadingState;
}

export interface ChatListItemProps {
  id: number;
  isClosed: boolean;
  reason: string;
  fireConsole: string;
  date: {
    created: string;
    updated: string;
  };
  attorney: {
    id: number;
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}

export interface ChatListProps {
  data: ChatListItemProps[];
  count: number;
}

export interface users {
  id: number;
  name: string;
  profilePhoto: string;
  userType: number;
  latestMessage?: string;
  time?: FirebaseFirestoreTypes.Timestamp;
  chatClosed?: boolean;
}
