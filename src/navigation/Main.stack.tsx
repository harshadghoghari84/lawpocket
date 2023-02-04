import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// relative path
import { Route } from 'src/constants/navigationConstants';
import Subscription from 'src/screens/Subscription.screen';

import { AppRoutes } from 'src/types/navigation.types';

import Reviews from 'src/screens/Reviews.screen';
import ChangePassword from 'src/screens/ChangePassword.screen';
import EditProfile from 'src/screens/EditProfile.screen';
import Setting from 'src/screens/Setting.screen';
import Notification from 'src/screens/Notification.screen';
import TimeTracker from 'src/screens/TimeTracker.screen';
import MyFeeds from 'src/screens/MyFeeds.screen';
import EditPost from 'src/screens/EditPost.screen';
import CreatePost from 'src/screens/CreatePost.screen';
import PracticeArea from 'src/screens/PracticeArea.screen';
import ChatRoom from 'src/screens/Chat/Chatroom.screen';
import OtherUserProfile from 'src/screens/OtherUserProfile.screen';
import Storage from 'src/screens/Storage.screen';
import FileView from 'src/screens/FileViewer.screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { makeStyles } from 'react-native-elements';
import Splash from 'src/screens/Splash.screen';
import AuthStack from 'src/navigation/Auth.stack';
import BottomBar from 'src/navigation/Bottombar';
import SelectIssue from 'src/screens/CaseFile/CaseFile.SelectIssue.screen';
import CaseFileLocation from 'src/screens/CaseFile/CaseFile.SelectLocation.screen';
import CaseFileDescription from 'src/screens/CaseFile/CaseFile.Description.screen';
import CaseFileCheckData from 'src/screens/CaseFile/CaseFile.CheckData.screen';
import InformationAboutIssue from 'src/screens/CaseFile/InformationAboutIssue.screen';
import Lawyers from 'src/screens/Lawyer/Lawyers.screen';
import LawyerProfile from 'src/screens/Lawyer/LawyerProfile.screen';
import FindLawyers from 'src/screens/Lawyer/FindLawyers.screen';
import FilterLawyers from 'src/screens/Lawyer/FilterLawyers.screen';
import MyProfile from 'src/screens/MyProfile.screen';
import NewPassword from 'src/screens/Authentication/NewPassword';
import VerifyOtpScreen from 'src/screens/OtpVerfify.screen';
import LocationUpdate from 'src/screens/LocationUpdate.screen';
import EmailVerify from 'src/screens/EmailVerify.screen';
import BlockedUser from 'src/screens/BlockedUser.screen';
import CaseFileCommonIssue from 'src/screens/CaseFile/CaseFile.CommonIssue.screen';
import OnBoarding from 'src/screens/onBoarding/onBoarding';
import FeedsSearch from 'src/screens/FeedsSearch.screen';
import MyCustomers from 'src/screens/MyCustomers';

const Stack = createStackNavigator<AppRoutes>();

const MainStack = () => {
  const styles = useStyles();

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={Route.navSplash}
      >
        <Stack.Screen name={Route.navSplash} component={Splash} />
        <Stack.Screen name={Route.navOnBoarding} component={OnBoarding} />
        <Stack.Screen name={Route.navAuthentication} component={AuthStack} />
        <Stack.Screen name={Route.navSubscriptions} component={Subscription} />
        <Stack.Screen name={Route.navDashboard} component={BottomBar} />
        <Stack.Screen name={Route.navReviewsScreen} component={Reviews} />
        <Stack.Screen name={Route.navBlockedUser} component={BlockedUser} />
        <Stack.Screen name={Route.navMyProfileScreen} component={MyProfile} />
        <Stack.Screen name={Route.navMyCustomers} component={MyCustomers} />
        <Stack.Screen
          name={Route.navChangePassword}
          component={ChangePassword}
        />
        <Stack.Screen name={Route.navNewPassword} component={NewPassword} />
        <Stack.Screen name={Route.navEditProfile} component={EditProfile} />
        <Stack.Screen name={Route.navEmailVerify} component={EmailVerify} />
        <Stack.Screen name={Route.navVerifyOtp} component={VerifyOtpScreen} />
        <Stack.Screen name={Route.navSetting} component={Setting} />
        <Stack.Screen name={Route.navPracticeArea} component={PracticeArea} />
        <Stack.Screen
          name={Route.navUpdateLocation}
          component={LocationUpdate}
        />
        <Stack.Screen name={Route.navNotification} component={Notification} />
        <Stack.Screen name={Route.navFeedsSearch} component={FeedsSearch} />
        <Stack.Screen name={Route.navTimeTracker} component={TimeTracker} />
        <Stack.Screen name={Route.navMyFeeds} component={MyFeeds} />
        <Stack.Screen name={Route.navEditPost} component={EditPost} />
        <Stack.Screen name={Route.navCreatePost} component={CreatePost} />
        <Stack.Screen name={Route.navChatRoom} component={ChatRoom} />
        <Stack.Screen name={Route.navStorage} component={Storage} />
        <Stack.Screen name={Route.navFileViewer} component={FileView} />
        <Stack.Screen
          name={Route.navOtherUserProfile}
          component={OtherUserProfile}
        />
        <Stack.Screen name={Route.navSelectIssue} component={SelectIssue} />
        <Stack.Screen
          name={Route.navCaseFileCommonIssue}
          component={CaseFileCommonIssue}
        />
        <Stack.Screen
          name={Route.navCaseFileLocation}
          component={CaseFileLocation}
        />
        <Stack.Screen
          name={Route.navCaseFileDescription}
          component={CaseFileDescription}
        />
        <Stack.Screen
          name={Route.navCaseFileCheckData}
          component={CaseFileCheckData}
        />
        <Stack.Screen
          name={Route.navInformationAboutIssue}
          component={InformationAboutIssue}
        />
        <Stack.Screen name={Route.navLawyers} component={Lawyers} />
        <Stack.Screen
          name={Route.navLawyersProfile}
          component={LawyerProfile}
        />
        <Stack.Screen name={Route.navFindLawyer} component={FindLawyers} />
        <Stack.Screen name={Route.navFilterLawyers} component={FilterLawyers} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainStack;

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
}));
