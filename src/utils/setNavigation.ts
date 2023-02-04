import { CommonActions, NavigationProp } from '@react-navigation/native';
import { SetupProfileStatus, UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { CurrentUser } from 'src/types/user.types';

export const init = async (
  currentUser: CurrentUser,
  navigation: NavigationProp<{}>,
) => {
  const checkVerifyByAdmin = (cUser: CurrentUser) => {
    if (cUser?.isVerify === SetupProfileStatus.VERIFY) {
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
        cUser.userType === UserType.ATTORNEY ||
        cUser.userType === UserType.LAW_FIRM ||
        cUser.userType === UserType.LEGAL_SERVICE_PROVIDER
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
  // console.log('currentUser social', currentUser);
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
  // if (currentUser) {
  //   if (
  //     currentUser.userType === UserType.CLIENT ||
  //     currentUser.userType === UserType.ATTORNEY
  //   ) {
  //     currentUser?.steps == null
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navSetProfileIntro }],
  //           }),
  //         )
  //       : currentUser?.steps === 0
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navDashboard }],
  //           }),
  //         )
  //       : currentUser?.steps === 1
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [{ name: Route.navRegister1 }],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 2
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 1,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 3
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 2,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     {
  //                       name: Route.navSetProfileAreaOfLaw,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 4
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 3,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     {
  //                       name: Route.navSetProfileAreaOfLaw,
  //                     },
  //                     {
  //                       name: Route.navSetProfileProfilePhoto,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navDashboard }],
  //           }),
  //         );
  //   } else if (currentUser.userType === UserType.LAW_STUDENT) {
  //     currentUser?.steps == null
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navSetProfileIntro }],
  //           }),
  //         )
  //       : currentUser?.steps === 0
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navDashboard }],
  //           }),
  //         )
  //       : currentUser?.steps === 1
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [{ name: Route.navRegister1 }],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 2
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 1,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 3
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 2,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     {
  //                       name: Route.navSetProfileAreaOfLaw,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 4
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 3,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     { name: Route.navSetProfileAreaOfLaw },
  //                     {
  //                       name: Route.navSetProfileStudentEmail,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 5
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 4,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     { name: Route.navSetProfileAreaOfLaw },
  //                     {
  //                       name: Route.navSetProfileStudentEmail,
  //                     },
  //                     {
  //                       name: Route.navSetProfileProfilePhoto,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navDashboard }],
  //           }),
  //         );
  //   } else if (
  //     currentUser.userType === UserType.LAW_FIRM ||
  //     currentUser.userType === UserType.LEGAL_SERVICE_PROVIDER
  //   ) {
  //     currentUser?.steps == null
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navSetProfileIntro }],
  //           }),
  //         )
  //       : currentUser?.steps === 0
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navDashboard }],
  //           }),
  //         )
  //       : currentUser?.steps === 1
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [{ name: Route.navRegister1 }],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 2
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 1,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 3
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 2,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     {
  //                       name: Route.navSetProfileAreaOfLaw,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 4
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 3,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     {
  //                       name: Route.navSetProfileAreaOfLaw,
  //                     },
  //                     {
  //                       name: Route.navSetProfileAssociationNum,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : currentUser?.steps === 5
  //       ? navigation.dispatch(
  //           CommonActions.reset({
  //             index: 4,
  //             routes: [
  //               {
  //                 name: Route.navAuthentication,
  //                 state: {
  //                   routes: [
  //                     { name: Route.navRegister1 },
  //                     { name: Route.navSetProfileLocation },
  //                     {
  //                       name: Route.navSetProfileAreaOfLaw,
  //                     },
  //                     {
  //                       name: Route.navSetProfileAssociationNum,
  //                     },
  //                     {
  //                       name: Route.navSetProfileProfilePhoto,
  //                     },
  //                   ],
  //                 },
  //               },
  //             ],
  //           }),
  //         )
  //       : navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: Route.navDashboard }],
  //           }),
  //         );
  //   } else {
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: Route.navSetProfileIntro }],
  //       }),
  //     );
  //   }
  // } else {
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{ name: Route.navSetProfileIntro }],
  //     }),
  //   );
  // }
};
