import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// relative path
import { Route } from 'src/constants/navigationConstants';

import { AuthenticationRoutes } from 'src/types/navigation.types';
import Login from 'src/screens/Authentication/Login.screen';
import Register1 from 'src/screens/Authentication/Register/Register1.screen';
import Register2 from 'src/screens/Authentication/Register/Register2.screen';
import SetProfileIntro from 'src/screens/Authentication/Setprofile/Setprofile.intro.screen';
import SetProfileLocation from 'src/screens/Authentication/Setprofile/Setprofile.location.screen';
import SetProfileAreaOfLaw from 'src/screens/Authentication/Setprofile/Setprofile.areaoflaw.screen';
import SetProfileLawDegree from 'src/screens/Authentication/Setprofile/Setprofile.lawdegree.screen';
import SetProfileAssociationNum from 'src/screens/Authentication/Setprofile/Setprofile.associationnum.screen';
import SetProfileProfilePhoto from 'src/screens/Authentication/Setprofile/Setprofile.profilephoto.screen';
import SetProfileCheckData from 'src/screens/Authentication/Setprofile/Setprofile.checkdata.screen';
import SetProfileStudentEmail from 'src/screens/Authentication/Setprofile/SetProfile.studentEmail.screen';

const Stack = createStackNavigator<AuthenticationRoutes>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Route.navLogin} component={Login} />
      <Stack.Screen name={Route.navRegister1} component={Register1} />
      <Stack.Screen name={Route.navRegister2} component={Register2} />
      <Stack.Screen
        name={Route.navSetProfileIntro}
        component={SetProfileIntro}
      />
      <Stack.Screen
        name={Route.navSetProfileLocation}
        component={SetProfileLocation}
      />
      <Stack.Screen
        name={Route.navSetProfileAreaOfLaw}
        component={SetProfileAreaOfLaw}
      />
      <Stack.Screen
        name={Route.navSetProfileLawDegree}
        component={SetProfileLawDegree}
      />
      <Stack.Screen
        name={Route.navSetProfileAssociationNum}
        component={SetProfileAssociationNum}
      />
      <Stack.Screen
        name={Route.navSetProfileProfilePhoto}
        component={SetProfileProfilePhoto}
      />
      <Stack.Screen
        name={Route.navSetProfileCheckData}
        component={SetProfileCheckData}
      />
      <Stack.Screen
        name={Route.navSetProfileStudentEmail}
        component={SetProfileStudentEmail}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
