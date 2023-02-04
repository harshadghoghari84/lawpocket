interface subscriptionProps {
  attorneyCount: number;
  description: string;
  gbStorage: string;
  loginCount: number;
  product: string;
  title: string;
}
import { RateReviewDataProps } from 'src/types/reviewrate.types';

export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isDisable: boolean;
  expiryDate: string;
  userType: number;
  state: string;
  city: string;
  profilePhoto: string;
  studentEmail: string;
  associationNumber: string;
  steps: number;
  userPracticeArea: PracticeArea[];
  review?: RateReviewDataProps[];
  reviewCount?: number;
  myClient?: number;
  sharedFileCount?: number;
  isVerify: number;
  isEmailVerify: boolean;
  allowedToRate?: boolean;
  avgRating: number;
  isAllowNotification: boolean;
  subscription: subscriptionProps;
  activeChatCount: number;
  inActiveChatCount: number;
  activeChat: string;
  isBlocked?: boolean;
  chatClosed?: boolean;
  unReadCount: number;
}

export interface PracticeArea {
  id: number;
  name?: string;
}
