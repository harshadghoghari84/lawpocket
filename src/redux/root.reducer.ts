import { combineReducers } from 'redux';
import { RootReduxState } from 'src/types/redux.types';
import global from 'src/redux/global/global.slice';
import settings from 'src/redux/settings/settings.slice';
import progressCount from 'src/redux/progressCount/count.slice';
import authentication from 'src/redux/authentication/authentication.slice';
import setProfile from 'src/redux/setProfile/setProfile.slice';
import lawyer from 'src/redux/lawyer/lawyer.slice';
import blockUser from 'src/redux/blockUser/blockUser.slice';
import myPocket from 'src/redux/myPocket/myPocket.slice';
import updateProfile from 'src/redux/updateProfile/updateProfile.slice';
import myCustomer from 'src/redux/myCustomer/myCustomer.slice';
import caseFile from 'src/redux/caseFile/caseFile.slice';
import subscription from 'src/redux/subscription/subscription.slice';
import chat from 'src/redux/chat/chat.slice';
import feeds from 'src/redux/feeds/feeds.slice';

const rootReducer = combineReducers<RootReduxState>({
  settings,
  global,
  progressCount,
  authentication,
  setProfile,
  lawyer,
  blockUser,
  myPocket,
  updateProfile,
  myCustomer,
  caseFile,
  subscription,
  chat,
  feeds,
});

export default rootReducer;
