import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NameFirstChar } from 'src/components/NameFirstChar';
import ChatIcon from 'src/components/svg/ChatIcon';
import FeedsIcon from 'src/components/svg/FeedsIcon';
import HomeIcon from 'src/components/svg/HomeIcon';
import NotificationIcon from 'src/components/svg/NotificationIcon';
import PocketIcon from 'src/components/svg/PocketIcon';
import SearchIcon from 'src/components/svg/SearchIcon';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { ChatTopTab } from 'src/navigation/Chat.stack';
import { MyPocketTopTab } from 'src/navigation/MyPocket.stack';
import Feeds from 'src/screens/Feeds.screen';
import Home from 'src/screens/Home.screen';
import {
  BottomTabNavigationProps,
  BottomTabRoutes,
} from 'src/types/navigation.types';

const Tab = createBottomTabNavigator<BottomTabRoutes>();

const BottomBar: React.FC<BottomTabNavigationProps<Route.navHome>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const { data: currentUser } = useMeQuery();

  const Notification = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Route.navNotification)}
        activeOpacity={0.6}
        style={styles.notificationIconCont}
      >
        <NotificationIcon color={theme.colors.primary} />
        {currentUser?.unReadCount > 0 ? (
          <View style={styles.notificationReqCount} />
        ) : null}
      </TouchableOpacity>
    );
  };
  const Search = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Route.navFeedsSearch)}
        activeOpacity={0.6}
        style={styles.searchIconCont}
      >
        <SearchIcon color={theme.colors.primary} />
      </TouchableOpacity>
    );
  };

  const FeedHeaderRight = () => {
    return (
      <View style={styles.feedRightCont}>
        <Search />
        <Notification />
      </View>
    );
  };
  const Profile = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Route.navMyProfileScreen)}
        activeOpacity={0.6}
        style={styles.headerTrackerCont}
      >
        {currentUser?.profilePhoto ? (
          <Image
            style={styles.Profile}
            source={{
              uri: currentUser?.profilePhoto,
            }}
          />
        ) : (
          <NameFirstChar
            size={30}
            name={
              currentUser?.firstName && currentUser?.lastName
                ? `${currentUser?.firstName} ${currentUser?.lastName}`
                : currentUser?.firstName
                ? `${currentUser?.firstName}`
                : currentUser?.lastName
                ? `${currentUser?.lastName}`
                : ''
            }
          />
        )}
        {/* <MaterialCommunityIcons
        name="timer-outline"
        size={20}
        color={theme.colors.primary}
      />
      <Text style={styles.txtTracker}>Tracker</Text> */}
      </TouchableOpacity>
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleAlign: 'center',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={Route.navHome}
        component={Home}
        options={{
          headerTitle: 'Law Pocket',
          headerStyle: [
            styles.headerStyle,
            {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 0.5,
            },
          ],
          // tabBarLabel: ({ focused }) => (
          //   <>
          //     <Text
          //       style={{
          //         color: focused ? theme.colors.primary : theme.colors.grey,
          //       }}>
          //       {Route.navHome}
          //     </Text>
          //     <View
          //       style={[
          //         styles.bottomIconLine,
          //         {
          //           backgroundColor: focused
          //             ? theme.colors.primary
          //             : theme.colors.transparent,
          //         },
          //       ]}
          //     />
          //   </>
          // ),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconFocused,
                { marginBottom: focused && theme.spacing.s },
              ]}
            >
              <HomeIcon
                color={focused ? theme.colors.primary : theme.colors.grey}
              />
              <View
                style={[
                  styles.bottomIconLine,
                  {
                    backgroundColor: focused
                      ? theme.colors.primary
                      : theme.colors.transparent,
                  },
                ]}
              />
            </View>
          ),
          headerLeft: () => Profile(),
          headerRight: () => Notification(),
        }}
      />
      <Tab.Screen
        name={Route.navChat}
        component={ChatTopTab}
        options={{
          headerStyle: styles.headerStyle,

          // tabBarLabel: ({ focused }) => (
          //   <>
          //     <Text
          //       style={{
          //         color: focused ? theme.colors.primary : theme.colors.grey,
          //       }}>
          //       {Route.navChat}
          //     </Text>
          //     <View
          //       style={[
          //         styles.bottomIconLine,
          //         {
          //           backgroundColor: focused
          //             ? theme.colors.primary
          //             : theme.colors.transparent,
          //         },
          //       ]}
          //     />
          //   </>
          // ),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconFocused,
                { marginBottom: focused && theme.spacing.s },
              ]}
            >
              <ChatIcon
                color={focused ? theme.colors.primary : theme.colors.grey}
              />
              <View
                style={[
                  styles.bottomIconLine,
                  {
                    backgroundColor: focused
                      ? theme.colors.primary
                      : theme.colors.transparent,
                  },
                ]}
              />
            </View>
          ),
          headerLeft: () => Profile(),
          headerRight: () => Notification(),
        }}
      />
      <Tab.Screen
        name={Route.navFeeds}
        component={Feeds}
        options={{
          headerStyle: styles.headerStyle,

          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconFocused,
                { marginBottom: focused && theme.spacing.s },
              ]}
            >
              <FeedsIcon
                color={focused ? theme.colors.primary : theme.colors.grey}
              />
              <View
                style={[
                  styles.bottomIconLine,
                  {
                    backgroundColor: focused
                      ? theme.colors.primary
                      : theme.colors.transparent,
                  },
                ]}
              />
            </View>
          ),
          headerLeft: () => Profile(),
          headerRight: () => FeedHeaderRight(),
        }}
      />
      <Tab.Screen
        name={Route.navMyPocket}
        component={MyPocketTopTab}
        options={{
          headerTitle: 'My Pocket',
          headerStyle: styles.headerStyle,
          // headerShown: false,
          // tabBarLabel: ({ focused }) => (
          //   <>
          //     <Text
          //       style={{
          //         color: focused ? theme.colors.primary : theme.colors.grey,
          //       }}>
          //       {'My Profile'}
          //     </Text>
          //     <View
          //       style={[
          //         styles.bottomIconLine,
          //         {
          //           backgroundColor: focused
          //             ? theme.colors.primary
          //             : theme.colors.transparent,
          //         },
          //       ]}
          //     />
          //   </>
          // ),
          headerLeft: () => Profile(),
          headerRight: () => Notification(),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconFocused,
                { marginBottom: focused && theme.spacing.s },
              ]}
            >
              <PocketIcon
                color={focused ? theme.colors.primary : theme.colors.grey}
              />
              <View
                style={[
                  styles.bottomIconLine,
                  {
                    backgroundColor: focused
                      ? theme.colors.primary
                      : theme.colors.transparent,
                  },
                ]}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  notificationIconCont: {
    marginRight: theme.spacing.m,
    backgroundColor: theme.colors.notificationBackColor,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadii.xl,
  },
  searchIconCont: {
    marginRight: theme.spacing.s,
    // backgroundColor: theme.colors.notificationBackColor,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadii.xl,
  },
  notificationReqCount: {
    position: 'absolute',
    backgroundColor: theme.colors.pinkDark,
    borderRadius: theme.borderRadii.l,
    right: 3,
    top: -2,
    height: 8,
    width: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNotificationReqCount: {
    fontSize: theme.fontSize.s - 2,
    color: theme.colors.white,
    fontWeight: '500',
  },
  feedsRightHeaderCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Profile: {
    height: 30,
    width: 30,
    borderRadius: theme.borderRadii.xl,
  },
  headerTrackerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.m,
    borderRadius: theme.spacing.xl,
  },
  txtTracker: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginLeft: theme.spacing.s - 3,
    color: theme.colors.primary,
  },
  iconFocused: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIconLine: { height: 2, width: 30, marginTop: theme.spacing.s },
  tabBarStyle: {
    // height: 60,
    borderTopRightRadius: theme.borderRadii.l,
    borderTopLeftRadius: theme.borderRadii.l,
    backgroundColor: theme.colors.background,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
    paddingVertical: theme.spacing.s - 3,
    borderTopColor: theme.colors.transparent,
  },
  headerTitleStyle: {
    width: 150,
    fontSize: theme.fontSize.m + 3,
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  headerStyle: {
    // height: Platform.OS === 'ios' ? 100 : 50,
    // borderBottomColor: theme.colors.headerBottomLineColor,
    // borderBottomWidth: 1,
    backgroundColor: theme.colors.background,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchIcon: {
    marginRight: theme.spacing.m - 6,
    marginTop: theme.spacing.s - 7,
  },
  feedRightCont: {
    flexDirection: 'row',
  },
}));
export default BottomBar;
