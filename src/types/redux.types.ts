import { GlobalState } from 'src/types/global.types';

import { Action, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { SettingsStateProps } from 'src/types/settings.types';
import { ProgressCountState } from 'src/types/common.types';
import { AuthenticationState } from 'src/types/authentication.types';
import { setProfileState } from 'src/types/setProfile.types';
import { lawyerState } from 'src/types/lawyer.types';
import { BlockUser } from 'src/types/blockUser.types';
import { MyPocketState } from 'src/types/myPocket.types';
import { updateProfileState } from 'src/types/updateProfile';
import { caseFileState } from 'src/types/caseFile.types';
import { SubscriptionState } from 'src/types/subscription.types';
import { MyCustomer } from 'src/types/myCustomer.types';
import { chatState } from 'src/types/chat.types';
import { feedsState } from 'src/types/feed.types';
import { notificationState } from 'src/types/notification.types';

export interface RootReduxState {
  settings: SettingsStateProps;
  global: GlobalState;
  progressCount: ProgressCountState;
  authentication: AuthenticationState;
  setProfile: setProfileState;
  updateProfile: updateProfileState;
  lawyer: lawyerState;
  caseFile: caseFileState;
  blockUser: BlockUser;
  myPocket: MyPocketState;
  subscription: SubscriptionState;
  myCustomer: MyCustomer;
  chat: chatState;
  feeds: feedsState;
  notification: notificationState;
}

export type AppDispatch = ThunkDispatch<
  RootReduxState,
  unknown,
  Action<string>
>;

export type AppThunk<T = Promise<void> | void> = ThunkAction<
  T,
  RootReduxState,
  unknown,
  Action<string>
>;
