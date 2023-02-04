import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// relative path
import { Route } from 'src/constants/navigationConstants';
import { HomeRoutes } from 'src/types/navigation.types';
import Home from 'src/screens/Home.screen';

const Stack = createStackNavigator<HomeRoutes>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Route.navHomeScreen} component={Home} />
    </Stack.Navigator>
  );
};

export default HomeStack;
