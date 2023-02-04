import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GetLawyersProps } from 'src/types/lawyers.types';
import { StorageItemProps } from 'src/types/settings.types';

export type AppRoutes = {
  Splash: undefined;
  OnBoarding: undefined;
  Authentication: undefined;
  Subscriptions: { activeBack: boolean };
  DashBoard: undefined;
  Reviews: { userId?: number };
  ChangePassword: undefined;
  NewPassword: { token: string };
  EditProfile: undefined;
  UpdateLocation: undefined;
  VerifyOtp: undefined;
  EmailVerify: { token: string; email: string };
  Setting: { activeBack: boolean };
  Notification: undefined;
  FeedsSearch: undefined;
  TimeTracker: undefined;
  MyFeeds: undefined;
  MyCustomers: undefined;
  EditPost: {
    data: {
      name: string;
      profile: string;
      image: { img: string }[];
      description: string;
    };
  };
  CreatePost: undefined;
  PracticeArea: undefined;
  Chat: undefined;
  ChatRoom: {
    id: number;
    chat_id?: number;
    sender_id?: number;
    closedChat?: boolean;
    fireConsole?: string;
  };
  OtherUserProfile: {
    // data: {
    //   id: number;
    //   // name?: string;
    //   // profilePhoto: string;
    //   // userType?: number;
    //   // chatId?: string;
    //   // firstName?: string;
    //   // lastName?: string;
    //   // state?: string;
    //   // city?: string;
    //   // rateOfHour?: string;
    //   // userPracticeArea?: UserPracticeAreaProps[];
    //   // ratingReview?: number;
    //   // myCustomer?: number;
    //   chatID?: string;
    //   fromLawyer?: boolean;
    // };
    id: number;
  };
  Storage: { activeAdd: boolean };
  FileViewer: { data: StorageItemProps };
  SelectIssue: undefined;
  CaseFileLocation: undefined;
  CaseFileDescription: undefined;
  CaseFileCheckData: undefined;
  CaseFileCommonIssue: undefined;
  InformationAboutIssue: { activeUpdate?: boolean };
  Lawyers: { isFilter?: boolean };
  LawyersProfile: { item: GetLawyersProps };
  FindLawyer: undefined;
  FilterLawyers: undefined;
  MyProfileScreen: undefined;
  BlockedUsers: { callBack?: () => void };
};

export type AuthenticationRoutes = {
  Login: undefined;
  Register1: undefined;
  Register2: { token: string; activeType: string };
  MissingEmail: undefined;
  SetProfile: { firstName: string };
  SetProfileLocation: undefined;
  SetProfileAreaOfLaw: undefined;
  SetProfileLawDegree: undefined;
  SetProfileAssociationNum: undefined;
  SetProfileProfilePhoto: undefined;
  SetProfileCheckData: undefined;
  SetProfileStudentEmail: undefined;
  Subscriptions: undefined;
  DashBoard: undefined;
};

export type HomeRoutes = {
  HomeScreen: undefined;
  Feeds: undefined;
  Reviews: undefined;
  Chat: undefined;
  SelectIssue: undefined;
  Lawyers: undefined;
};

export type BottomTabRoutes = {
  Home: undefined;
  Chat: undefined;
  MyPocket: { All: { activeAdd: boolean } };
  Feeds: undefined;
  MyProfileScreen: undefined;
  Notification: undefined;
  TimeTracker: undefined;
  Setting: undefined;
  EditProfile: undefined;
  MyFeeds: undefined;
  FeedsSearch: undefined;
  Reviews: undefined;
  ChangePassword: undefined;
  CreatePost: undefined;
  ChatRoom: { id: number; user_id?: number };

  OtherUserProfile: {
    // data: {
    //   id: number;
    //   // name: string;
    //   // profilePhoto: string;
    //   // userType: number;
    //   // chatClosed?: boolean;
    //   // blockedUser?: boolean;
    //   // chatId?: string;
    //   fromLawyer?: boolean;
    // };
    id: number;
  };
  Storage: { activeAdd: boolean };
};
export type ChatTopTabRoutes = {
  Active: undefined;
  Archived: undefined;
};
export type MyPocketTopTabRoutes = {
  All: undefined;
  Draft: undefined;
};

export interface MainNavigationProps<RouteName extends keyof AppRoutes> {
  navigation: StackNavigationProp<AppRoutes, 'Splash'>;
  route: RouteProp<AppRoutes, RouteName>;
}

export interface AuthNavigationProps<
  RouteName extends keyof AuthenticationRoutes,
> {
  navigation: StackNavigationProp<AuthenticationRoutes, RouteName>;
  route: RouteProp<AuthenticationRoutes, RouteName>;
}

export interface HomeNavigationProps<RouteName extends keyof HomeRoutes> {
  navigation: StackNavigationProp<HomeRoutes, RouteName>;
  route: RouteProp<HomeRoutes, RouteName>;
}

export interface BottomTabNavigationProps<
  RouteName extends keyof BottomTabRoutes,
> {
  navigation: BottomTabNavigationProp<BottomTabRoutes, RouteName>;
  route: RouteProp<BottomTabRoutes, RouteName>;
}

export interface ChatTopTabNavigationProps<
  RouteName extends keyof ChatTopTabRoutes,
> {
  navigation: MaterialTopTabNavigationProp<ChatTopTabRoutes, RouteName>;
  route: RouteProp<ChatTopTabRoutes, RouteName>;
}
export interface MyPocketTopTabNavigationProps<
  RouteName extends keyof MyPocketTopTabRoutes,
> {
  navigation: MaterialTopTabNavigationProp<MyPocketTopTabRoutes, RouteName>;
  route: RouteProp<MyPocketTopTabRoutes, RouteName>;
}
