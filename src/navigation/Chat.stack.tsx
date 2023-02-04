import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Route } from 'src/constants/navigationConstants';

import { Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';

import {
  ChatTopTabNavigationProps,
  ChatTopTabRoutes,
} from 'src/types/navigation.types';
import ActiveChat from 'src/screens/Chat/Activechat.screen';
import ArchivedChat from 'src/screens/Chat/Archivedchat.screen';

const Tab = createMaterialTopTabNavigator<ChatTopTabRoutes>();

export const ChatTopTab: React.FC<
  ChatTopTabNavigationProps<Route.navActiveChat>
> = () => {
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
      }}
    >
      <Tab.Screen
        name={Route.navActiveChat}
        component={ActiveChat}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.topTabItemCont}>
              <Text
                style={[
                  styles.txtTabBarLabel,
                  { color: focused ? theme.colors.primary : theme.colors.grey },
                ]}
              >
                {Route.navActiveChat}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={Route.navArchivedChat}
        component={ArchivedChat}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.txtTabBarLabel,
                { color: focused ? theme.colors.primary : theme.colors.grey },
              ]}
            >
              {Route.navArchivedChat}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const useStyles = makeStyles(theme => ({
  tabBarStyle: {
    backgroundColor: theme.colors.background,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarIndicatorStyle: {
    backgroundColor: theme.colors.primary,
    height: 3,
  },
  txtTabBarLabel: {
    fontSize: theme.fontSize.m + 2,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  tabBarItemStyle: {
    borderRightColor: theme.colors.primary,
    borderLeftWidth: 0.5,
  },
  topTabItemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topTabDivider: {
    height: 30,
    width: 1,
    backgroundColor: theme.colors.primary,
  },
}));
