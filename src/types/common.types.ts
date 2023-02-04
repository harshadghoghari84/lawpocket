import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ChatListItemProps } from 'src/types/chat.types';
import { GetLawyersProps } from 'src/types/lawyers.types';

export interface DashBoardItem {
  rate: number;
  id: number;
  review: string;
  date: {
    updated: string;
  };
  byUser: {
    id: number;
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}

export interface DashBoardList {
  lstReview: DashBoardItem[];
  activeChats: ChatListItemProps[];
}

// interface practiceAreaId {
//   id: number;
//   practiceAreaId: number;
//   userId: number;
// }
export interface LawyerItemProps {
  item?: GetLawyersProps;
}

export interface FeedsDataItemProps {
  item?: {
    _id: number;
    profile: string;
    name: string;
    time: string;
    description: string;
    video?: string;
    image?: { img: string }[];
  };

  pauseVideo?: boolean;
  setPauseVideo?: (val: boolean) => void;
  edit?: boolean;
}

export interface ReviewDataItemsProps {
  index?: {};
  item?: {
    _id: number;
    profile: string;
    name: string;
    date: string;
    starCount: number;
    stars: { star: string }[];
    description: string;
  };
}

export interface ChatDataItemProps {
  item?: {
    id: number;
    isClosed: boolean;
    reason: string;
    fireConsole: string;
    date: {
      created: string;
      updated: string;
    };
    attorney?: {
      id: number;
      firstName: string;
      lastName: string;
      profilePhoto: string;
    };
    client?: {
      id: number;
      firstName: string;
      lastName: string;
      profilePhoto: string;
    };
  };
  closedChat?: boolean;
  setUserList?: (val: []) => void;
  setLoading?: (val: boolean) => void;
}

export interface ProgressCountState {
  count: number;
}

export interface ImageProps {
  name: string;
  type: string;
  uri: string;
}

export interface SettingItemProps {
  name?: string;
  data?: string;
  icon?: ReactElement;
  onPress?: () => void;
  toggle?: ReactElement;
  onlyShowData?: boolean;
  rightIconEnable?: boolean;
  viewContainer?: StyleProp<ViewStyle> | undefined;
}

export interface NotificationDataProps {
  profile: string;
  name: string;
  time: string;
  case: string;
}
