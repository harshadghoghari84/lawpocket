import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { Text } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import AllPocket from 'src/screens/Pocket/AllPocket.screen';
import DraftPocket from 'src/screens/Pocket/DraftPocket.screen';
import {
  MyPocketTopTabNavigationProps,
  MyPocketTopTabRoutes,
} from 'src/types/navigation.types';

const Tab = createMaterialTopTabNavigator<MyPocketTopTabRoutes>();

export const MyPocketTopTab: React.FC<
  MyPocketTopTabNavigationProps<Route.navAllPocket>
> = () => {
  const { theme } = useTheme();
  const styles = useStyles();
  const { data: currentUser } = useMeQuery();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
      }}
    >
      <Tab.Screen
        name={Route.navAllPocket}
        component={AllPocket}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.txtTabBarLabel,
                { color: focused ? theme.colors.primary : theme.colors.grey },
              ]}
            >
              {currentUser?.userType === UserType.CLIENT ||
              currentUser?.userType === UserType.LAW_STUDENT
                ? Route.navAllPocket
                : 'Documents'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name={Route.navDraftPocket}
        component={DraftPocket}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.txtTabBarLabel,
                { color: focused ? theme.colors.primary : theme.colors.grey },
              ]}
            >
              {currentUser?.userType === UserType.CLIENT ||
              currentUser?.userType === UserType.LAW_STUDENT
                ? Route.navDraftPocket
                : 'Shared by clients'}

              {/* {Route.navDraftPocket} */}
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
}));
