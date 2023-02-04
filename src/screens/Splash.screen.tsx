// relative path
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { API } from 'src/constants/apiEndpoints';
import { SetupProfileStatus, UserType } from 'src/constants/constants';
// import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { fetch } from 'src/redux/fetch';
import { CurrentUser } from 'src/types/user.types';
// import { useMeQuery } from 'src/hooks/useMeQuery';
import { checkLogin } from 'src/utils/checkLogin';
import RNBootSplash from 'react-native-bootsplash';
import { appAlreadyOpen } from 'src/utils/asyncStorage';

interface SplashScreenProps {}

const Splash: React.FC<SplashScreenProps> = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const IsLogin = async () => {
      setTimeout(async () => {
        await RNBootSplash.hide();
      }, 2000);

      if (await checkLogin()) {
        init();
      } else {
        if (await appAlreadyOpen()) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Route.navAuthentication }],
            }),
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Route.navOnBoarding }],
            }),
          );
        }
      }
    };

    IsLogin().finally();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const checkVerifyByAdmin = (currentUser: CurrentUser) => {
    if (currentUser?.isVerify === SetupProfileStatus.VERIFY) {
      if (currentUser?.subscription === null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Route.navSubscriptions }],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Route.navDashboard }],
          }),
        );
      }
    } else {
      if (
        currentUser.userType === UserType.ATTORNEY ||
        currentUser.userType === UserType.LAW_FIRM ||
        currentUser.userType === UserType.LEGAL_SERVICE_PROVIDER
      ) {
        navigation.dispatch(
          CommonActions.reset({
            index: 4,
            routes: [
              {
                name: Route.navAuthentication,
                state: {
                  routes: [
                    { name: Route.navRegister1 },
                    { name: Route.navSetProfileLocation },
                    {
                      name: Route.navSetProfileAreaOfLaw,
                    },
                    {
                      name: Route.navSetProfileProfilePhoto,
                    },
                    {
                      name: Route.navSetProfileCheckData,
                    },
                  ],
                },
              },
            ],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Route.navDashboard }],
          }),
        );
      }
    }
  };

  const init = async () => {
    const { data: currentUser } = await fetch<CurrentUser>({
      url: API.ME,
      method: 'GET',
    });
    if (currentUser) {
      if (
        currentUser.userType === UserType.CLIENT ||
        currentUser.userType === UserType.ATTORNEY
      ) {
        currentUser?.steps == null
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [{ name: Route.navSetProfileIntro }],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 0
          ? checkVerifyByAdmin(currentUser)
          : currentUser?.steps === 1
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [{ name: Route.navRegister1 }],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 2
          ? navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 3
          ? navigation.dispatch(
              CommonActions.reset({
                index: 2,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        {
                          name: Route.navSetProfileAreaOfLaw,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 4
          ? navigation.dispatch(
              CommonActions.reset({
                index: 3,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        {
                          name: Route.navSetProfileAreaOfLaw,
                        },
                        {
                          name: Route.navSetProfileProfilePhoto,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navDashboard }],
              }),
            );
      } else if (currentUser.userType === UserType.LAW_STUDENT) {
        currentUser?.steps == null
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [{ name: Route.navSetProfileIntro }],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 0
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navDashboard }],
              }),
            )
          : currentUser?.steps === 1
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [{ name: Route.navRegister1 }],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 2
          ? navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 3
          ? navigation.dispatch(
              CommonActions.reset({
                index: 2,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        {
                          name: Route.navSetProfileAreaOfLaw,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 4
          ? navigation.dispatch(
              CommonActions.reset({
                index: 3,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        { name: Route.navSetProfileAreaOfLaw },
                        {
                          name: Route.navSetProfileStudentEmail,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 5
          ? navigation.dispatch(
              CommonActions.reset({
                index: 4,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        { name: Route.navSetProfileAreaOfLaw },
                        {
                          name: Route.navSetProfileStudentEmail,
                        },
                        {
                          name: Route.navSetProfileProfilePhoto,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navDashboard }],
              }),
            );
      } else if (
        currentUser.userType === UserType.LAW_FIRM ||
        currentUser.userType === UserType.LEGAL_SERVICE_PROVIDER
      ) {
        currentUser?.steps == null
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [{ name: Route.navSetProfileIntro }],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 0
          ? checkVerifyByAdmin(currentUser)
          : currentUser?.steps === 1
          ? navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [{ name: Route.navRegister1 }],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 2
          ? navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 3
          ? navigation.dispatch(
              CommonActions.reset({
                index: 2,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        {
                          name: Route.navSetProfileAreaOfLaw,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 4
          ? navigation.dispatch(
              CommonActions.reset({
                index: 3,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        {
                          name: Route.navSetProfileAreaOfLaw,
                        },
                        {
                          name: Route.navSetProfileAssociationNum,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : currentUser?.steps === 5
          ? navigation.dispatch(
              CommonActions.reset({
                index: 4,
                routes: [
                  {
                    name: Route.navAuthentication,
                    state: {
                      routes: [
                        { name: Route.navRegister1 },
                        { name: Route.navSetProfileLocation },
                        {
                          name: Route.navSetProfileAreaOfLaw,
                        },
                        {
                          name: Route.navSetProfileAssociationNum,
                        },
                        {
                          name: Route.navSetProfileProfilePhoto,
                        },
                      ],
                    },
                  },
                ],
              }),
            )
          : navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Route.navDashboard }],
              }),
            );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: Route.navAuthentication,
                state: {
                  routes: [{ name: Route.navSetProfileIntro }],
                },
              },
            ],
          }),
        );
      }
    }
  };

  const styles = useStyles();
  return <View style={styles.container}>{/* <Text>law pocket</Text> */}</View>;
};

export default Splash;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
