import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import BottomSheetChooseLocation from 'src/components/BottomSheetChooseLocation';
import ModalFooter from 'src/components/BottomSheetFooter';
import ChatItem from 'src/components/ChatItem';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
import { Divider } from 'src/components/Divider';
import NearbyAttorneyView from 'src/components/home/NearbyAttorneyView';
import PracticeAreaView from 'src/components/home/PracticeAreaView';
import ReviewItem from 'src/components/ReviewItem';
import AskLawPocketIcon from 'src/components/svg/AskLawPocketIcon';
import AttorneyIcon from 'src/components/svg/AttorneyIcon';
import { ViewAllItemCont } from 'src/components/ViewAllItemCont';
import { ASPECT_RATIO } from 'src/constants';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAreaOfLaw } from 'src/hooks/useAreaOfLaw';
import { useDashBoardList } from 'src/hooks/useDashBoardList';
import { useLawyers } from 'src/hooks/useLawyers';
import { useStateOfCountry } from 'src/hooks/useLocation';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useMyPocket } from 'src/hooks/useMyPocket';
import {
  isDark,
  selectedLawyerLocation,
} from 'src/redux/settings/settings.selectors';
import {
  selectedFilterLawyer,
  setCurrentCaseFileId,
  setLawyerLocation,
  setSelectedCaseFileType,
  storage,
} from 'src/redux/settings/settings.slice';
import { ThemeProps } from 'src/types/global.types';
import { GetLawyersProps } from 'src/types/lawyers.types';
import { HomeNavigationProps } from 'src/types/navigation.types';

// const userIsAttorney = (userType: number) => {
//   return (
//     userType === UserType.ATTORNEY ||
//     userType === UserType.LAW_FIRM ||
//     userType === UserType.LEGAL_SERVICE_PROVIDER
//   );
// };

const Home: React.FC<HomeNavigationProps<Route.navHomeScreen>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const modalizeRef = React.useRef<Modalize>(null);
  const isEnabled = useSelector(isDark);
  const selectedLocation = useSelector(selectedLawyerLocation);
  const dispatch = useAppDispatch();
  const {
    data: currentUser,
    error,
    isFetching,
    isLoading,
  } = useMeQuery({ refetchInterval: 30000 });

  // const isAttorney = userIsAttorney(currentUser?.userType);

  const { data: myPocketData, refetch: reFetchMyPocket } = useMyPocket();
  const {
    data: dashBoardData,
    isLoading: dashBoardLoading,
    isRefetching,
    refetch: reFetchDashBoardData,
  } = useDashBoardList();
  const { data: practiceAreaData, refetch: reFetchPracticeAreaData } =
    useAreaOfLaw();
  const { data: stateData, refetch: reFetchStateData } = useStateOfCountry();
  const { data: lawyersData, refetch: reFetchLawyersData } = useLawyers(
    selectedLocation.join() || '',
    '',
    '',
    false,
  );

  const userName =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser?.firstName} ${currentUser?.lastName}`
      : currentUser?.firstName
      ? `${currentUser?.firstName}`
      : currentUser?.lastName
      ? `${currentUser?.lastName}`
      : '';

  const modalizeStateRef = React.useRef<Modalize>(null);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.addListener('focus', () => {
      pullToRefreshData();
      dispatch(setCurrentCaseFileId(''));
      dispatch(setSelectedCaseFileType(null));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  React.useEffect(() => {
    if (currentUser === null && !isLoading && !isFetching) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Route.navAuthentication }],
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, error]);

  useEffect(() => {
    if (currentUser?.state) {
      if (currentUser?.state && selectedLocation.length <= 0) {
        dispatch(setLawyerLocation([currentUser?.state]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const pullToRefreshData = () => {
    setRefreshing(true);
    reFetchDashBoardData().then();
    reFetchMyPocket().then();
    reFetchLawyersData().then();
    reFetchPracticeAreaData().then();
    reFetchStateData().then();
  };

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [isRefetching, refreshing]);

  // React.useEffect(() => {
  //   if (selectedStateItem.length > 0) {
  //     // queryClient.invalidateQueries(QueryKeys.LAWYERS).then();
  //     // queryClient.refetchQueries(QueryKeys.LAWYERS).then();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedStateItem]);

  React.useEffect(() => {
    if (myPocketData) {
      dispatch(storage(myPocketData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPocketData]);

  // React.useEffect(() => {
  //   // const listUsers = async () => {s
  //   setLoading(true);

  //   firestore()
  //     .collection('Users')
  //     // .get()
  //     .onSnapshot({
  //       error: e => console.log('e :', e),
  //       next: querySnapshot => {
  //         // console.log('called');
  //         let totUser: users[] = [];
  //         querySnapshot.docs.forEach(documentSnapshot => {
  //           documentSnapshot.data().user.map((flt: users) => {
  //             if (flt.id === currentUser?.id) {
  //               totUser.push(...documentSnapshot.data().user);
  //             }
  //           });
  //         });
  //         // console.log('called 2');
  //         let finalUserList: users[] = [];
  //         totUser.filter((itm: users) => {
  //           if (itm.id !== currentUser?.id) {
  //             finalUserList.push(itm);
  //           }
  //         });

  //         let notBlockedUserList: users[] = [];
  //         finalUserList.filter((itm: users) => {
  //           if (!itm.chatClosed) {
  //             notBlockedUserList.push(itm);
  //           }
  //         });

  //         let onlyHaveChatUserList: users[] = [];

  //         notBlockedUserList.filter((itm: users) => {
  //           if (itm.latestMessage) {
  //             onlyHaveChatUserList.push(itm);
  //           }
  //         });
  //         setUserList(onlyHaveChatUserList);
  //         setLoading(false);
  //       },
  //     });
  //   // };

  //   // listUsers().then();
  // }, [currentUser]);

  const setLocation = (selectedItems: string[]) => {
    dispatch(setLawyerLocation(selectedItems));
  };

  // console.log('userList', userList);
  const getMessageFromTime = () => {
    var day = new Date();
    var hr = day.getHours();
    if (hr >= 0 && hr < 12) {
      return 'Good Morning';
    } else if (hr >= 12 && hr <= 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const renderPracticeAreaItem = (item: any) => {
    return <PracticeAreaView data={item} />;
  };

  const renderNearbyAttorneyItem = (item: GetLawyersProps, index: number) => {
    return <NearbyAttorneyView data={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isEnabled ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        // bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollCont}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.refreshLoaderColor}
            refreshing={refreshing}
            onRefresh={pullToRefreshData}
          />
        }
      >
        {/* <View style={styles.timerCont}>
          <View style={styles.nameAndTimerCont}>
            <Text style={styles.txtNameTimer}>James White</Text>
            <View style={styles.timIconCont}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={20}
                color={theme.colors.iconColor}
                style={styles.iconTracker}
              />
              <Text style={styles.time}>{time}</Text>
            </View>
          </View>
          <CustomButton
            name={'Stop'}
            smallBtn={WIDTH / 3}
            borderRadius={theme.borderRadii.m + 3}
            bgc={theme.colors.pinkDark}
            onPress={() => {
              BackgroundTimer.stopBackgroundTimer();
              // modalizeRef.current?.open();
            }}
          />
        </View> */}
        {/* <Divider /> */}
        {/* <View style={styles.topCont}>
          <View style={styles.workedHrCont}>
            <FontAwesome5
              name="briefcase"
              size={20}
              color={theme.colors.primary}
              style={styles.iconStyle}
            />
            <View style={styles.txtCont}>
              <Text style={styles.txtTopTitle}>Worked hours</Text>
              <Text style={styles.txtTopTitle2}>56:20 hrs</Text>
            </View>
          </View>
          <View style={styles.pocketSzCont}>
            <FontAwesome5
              name="th-list"
              size={20}
              color={theme.colors.primary}
              style={styles.iconStyle}
            />
            <View style={styles.txtCont}>
              <Text style={styles.txtTopTitle}>Pocket size</Text>
              <Text style={styles.txtTopTitle2}>120 MB</Text>
            </View>
          </View>
        </View> */}
        {/* <Divider /> */}
        <View style={styles.messageCont}>
          <Text
            style={styles.txtMessage}
          >{`Hello! ${getMessageFromTime()}, ${userName}`}</Text>
        </View>
        {/* <Divider /> */}
        {currentUser?.userType === UserType.CLIENT ||
        currentUser?.userType === UserType.LAW_STUDENT ? (
          <>
            <View style={styles.askLawPocketAndFindLawyer}>
              <ChooseItems
                title={'Ask Law Pocket'}
                icon={
                  <AskLawPocketIcon
                    color={theme.colors.primary}
                    height={20}
                    width={20}
                  />
                }
                secondIcon={
                  <Entypo
                    name={'chevron-thin-right'}
                    size={20}
                    color={theme.colors.primary}
                  />
                }
                bgc={theme.colors.primaryLightest}
                txtColor={theme.colors.textPrimary}
                onPress={() => {
                  navigation.navigate(Route.navSelectIssue);
                }}
              />
              <ChooseItems
                title={'Find attorneys'}
                icon={
                  <AttorneyIcon
                    color={theme.colors.primary}
                    height={20}
                    width={20}
                  />
                }
                secondIcon={
                  <Entypo
                    name={'chevron-thin-right'}
                    size={20}
                    color={theme.colors.primary}
                  />
                }
                bgc={theme.colors.primaryLightest}
                txtColor={theme.colors.textPrimary}
                onPress={() => {
                  dispatch(
                    selectedFilterLawyer({
                      state: '',
                      city: '',
                      practiceArea: null,
                    }),
                  );
                  navigation.navigate(Route.navLawyers);
                }}
              />
            </View>

            {practiceAreaData?.length > 0 && (
              <View style={styles.practiceAreaContainer}>
                <Text style={styles.txtMessage}>{'Practice area'}</Text>
                <ScrollView
                  style={styles.practiceAreaScrollContainer}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {practiceAreaData?.map(renderPracticeAreaItem)}
                </ScrollView>
              </View>
            )}

            <View style={styles.nearbyAttorneyContainer}>
              <View style={styles.nearbyAttorneyHeaderContainer}>
                <Text style={[styles.txtMessage, { flex: 1 }]}>
                  {'Nearby attorneys'}
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => modalizeStateRef.current?.open()}
                >
                  <View style={styles.locationIconContainer}>
                    <Icon
                      size={15}
                      name="location-sharp"
                      type={'ionicon'}
                      color={theme.colors.primary}
                      tvParallaxProperties={undefined}
                    />
                    <Text style={[styles.locationText, { marginLeft: 5 }]}>
                      {'Change location'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {lawyersData?.length > 0 ? (
                <ScrollView
                  style={{ marginTop: theme.spacing.s }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {lawyersData?.map(renderNearbyAttorneyItem)}
                </ScrollView>
              ) : (
                <View style={styles.noDataFound}>
                  <Text style={styles.noDataText}>no data found</Text>
                </View>
              )}
            </View>

            <Divider />
            {/* <View style={styles.askLawPocketAndFindLawyer}>
              <TouchableOpacity activeOpacity={0.6} style={styles.cont}>
                <AskLawPocketIcon
                  color={theme.colors.primary}
                  height={40}
                  width={40}
                />
                <Text style={styles.txtItemCont}>Ask law pocket</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate(Route.navLawyers)}
                activeOpacity={0.6}
                style={styles.cont}>
                <AttorneyIcon
                  color={theme.colors.primary}
                  height={40}
                  width={40}
                />
                <Text style={styles.txtItemCont}>Find lawyer</Text>
              </TouchableOpacity>
            </View>
            <Divider /> */}
          </>
        ) : null}
        {/* {
          dashBoardData?.activeChats?.length > 0 &&
          dashBoardData?.lstReview?.length > 0 ? (
            <> */}
        {dashBoardData?.lstReview?.length > 0 ? (
          <>
            <View style={styles.recentChatCont}>
              <ViewAllItemCont
                name={'Recent Reviews'}
                style={styles.viewAllCont}
                onPress={() => {
                  navigation.navigate({
                    name: Route.navReviewsScreen as never,
                    params: { userId: '' } as never,
                  });
                }}
              />

              {dashBoardData?.lstReview?.map(item => {
                return (
                  <ReviewItem
                    byUser={item.byUser}
                    date={item.date}
                    id={item.id}
                    rate={item.rate}
                    review={item.review}
                  />
                );
              })}
            </View>
            <Divider />
          </>
        ) : dashBoardLoading ? (
          <ActivityIndicator />
        ) : null}
        {dashBoardData?.activeChats?.length > 0 ? (
          <>
            <View style={styles.recentChatCont}>
              <ViewAllItemCont
                name={'Recent chats'}
                style={styles.viewAllCont}
                onPress={() => {
                  navigation.navigate(Route.navChat);
                }}
              />

              {dashBoardData?.activeChats?.map(item => {
                return <ChatItem item={item} />;
              })}
            </View>
            <Divider />
          </>
        ) : dashBoardLoading ? (
          <ActivityIndicator />
        ) : null}
        {/* </>
          ) : null
          // <>
          //   {isAttorney ? (
          //     // <NoDataFound
          //     //   noDataText={'No data found!'}
          //     //   noDataIcon={
          //     //     <Image
          //     //       source={require('src/helper/image/noData.png')}
          //     //       style={styles.noDataIcons}
          //     //     />
          //     //   }
          //     // />
          //     <View style={styles.meditationCont}>
          //       <Text style={styles.txtMeditationView}>
          //         Your profile is set!
          //       </Text>
          //       <LottieView
          //         style={styles.sliderImage}
          //         source={require('src/helper/meditation.json')}
          //         autoPlay
          //         loop
          //       />
          //       <View style={styles.innerMeditationCont}>
          //         <Text style={styles.txtMeditation2}>
          //           Make your presence on Law Pocket by uploading posts daily.
          //         </Text>
          //         <Text
          //           onPress={() => {
          //             navigation.navigate({
          //               name: Route.navCreatePost as never,
          //               params: {} as never,
          //             });
          //           }}
          //           style={[styles.txtMeditation2, styles.clickHere]}
          //         >
          //           Click here
          //         </Text>
          //       </View>
          //     </View>
          //   ) : null}
          // </>
        } */}
        {/*  <View style={styles.feedsMainCont}>
          <ViewAllItemCont
            name={'Recent Feeds'}
            style={styles.itmHeadComp}
            onPress={() => {
              navigation.navigate(Route.navFeeds);
            }}
          />

          {FeedsData.map((item, index) => {
            return (
              <>
                <FeedsItem
                  item={item}
                  setPauseVideo={setPauseVideo}
                  pauseVideo={pauseVideo}
                />
                {index === FeedsData.length - 1 ? null : (
                  <View style={styles.DividerBmPadding}>
                    <Divider />
                  </View>
                )}
              </>
            );
          })}
        </View> */}
      </ScrollView>
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          handleStyle={styles.modalHandleStyle}
          FooterComponent={() => <ModalFooter />}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            bounces: false,
          }}
        >
          <>
            <View style={styles.modalCont}>
              <View style={styles.innerModalCont}>
                <View style={styles.imgCont}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                    }}
                    style={styles.img}
                  />
                </View>

                <Text style={styles.txtModalUserName}>James White</Text>
                <View
                  style={[
                    styles.timIconCont,
                    { marginTop: theme.spacing.l - 4 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={20}
                    color={theme.colors.pinkDark}
                    style={styles.iconTracker}
                  />
                  <Text style={[styles.time, { color: theme.colors.pinkDark }]}>
                    00:35:20
                  </Text>
                </View>
                <Text style={styles.txtEstimateTime}>10:00 AM to 10:35 AM</Text>
              </View>
              <TextInput
                placeholder="Reason"
                multiline={true}
                placeholderTextColor={theme.colors.grey}
                style={styles.txtInput}
                returnKeyType="done"
              />
              <CustomButton
                name="Submit"
                onPress={() => modalizeRef.current?.close()}
              />
            </View>
          </>
        </Modalize>
      </Portal>
      <BottomSheetChooseLocation
        modalizeRef={modalizeStateRef}
        locationData={stateData}
        title={'State'}
        selectedStateIso={[]}
        selectedStateItem={selectedLocation}
        setSelectedStateItem={setLocation}
        setSelectedStateIso={() => ''}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  scrollCont: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  topCont: {
    backgroundColor: theme.colors?.background,
    flexDirection: 'row',
    height: 100,
    paddingVertical: theme.spacing.m - 6,
  },
  workedHrCont: {
    flex: 1,
    flexDirection: 'row',
  },
  pocketSzCont: {
    flex: 1,
    flexDirection: 'row',
  },
  txtCont: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  txtTopTitle: {
    fontSize: theme.fontSize.m,
    fontWeight: '400',
    color: theme.colors.grey,
  },
  txtTopTitle2: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    marginTop: theme.spacing.m - 10,
    color: theme.colors.textPrimary,
  },
  iconStyle: {
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.m - 2,
  },
  recentChatCont: {
    marginVertical: theme.spacing.m,
  },
  chatAllCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.m - 6,
  },
  txtRecentChat: {
    fontSize: theme.fontSize.m + 4,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtViewAll: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    color: theme.colors.primary,
    marginRight: theme.spacing.m - 6,
  },
  outerViewAllCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DividerBmPadding: { marginBottom: theme.spacing.m - 6 },
  feedsMainCont: { paddingVertical: theme.spacing.m },
  itmHeadComp: { paddingHorizontal: theme.spacing.l - 4 },
  timerCont: {
    backgroundColor: theme.colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.l - 4,
    borderRadius: theme.borderRadii.l,
    marginHorizontal: theme.spacing.l - 4,
    marginVertical: theme.spacing.l - 4,
  },
  timIconCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTracker: {
    marginRight: theme.spacing.s - 5,
  },
  time: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtNameTimer: {
    fontSize: theme.fontSize.m + 5,
    marginBottom: theme.spacing.s,
    color: theme.colors.textPrimary,
  },
  nameAndTimerCont: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
  modalCont: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
    paddingBottom: theme.spacing.s,
  },
  innerModalCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
  },
  imgCont: {
    height: 120,
    width: 120,
    borderRadius: theme.borderRadii.xxl * 2,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  img: {
    height: 110,
    width: 110,
    borderRadius: theme.borderRadii.xxl * 2,
  },
  txtModalUserName: {
    fontSize: theme.fontSize.m + 5,
    fontWeight: '600',
    marginTop: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  txtInput: {
    height: 100,
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.m,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    padding: theme.spacing.m - 6,
    marginVertical: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtEstimateTime: {
    marginTop: theme.spacing.m - 6,
    color: theme.colors.grey,
    fontSize: theme.fontSize.m - 3,
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
  headerModal: {
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
    height: 10,
  },
  askLawPocketAndFindLawyer: {
    paddingHorizontal: theme.spacing.m + 4,
    paddingTop: theme.spacing.m + 4,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  itmSeparator: {
    backgroundColor: theme.colors.primaryLight,
    height: 0.5,
  },
  scrollContStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  noDataCont: {
    height: 200,
  },
  viewAllCont: { paddingHorizontal: theme.spacing.l - 4 },

  cont: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadii.l,
    padding: theme.spacing.m,
    minWidth: 150,
  },
  txtItemCont: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginTop: theme.spacing.l,
    color: theme.colors.textPrimary,
  },
  messageCont: {
    // marginLeft: theme.spacing.l,
    marginTop: theme.spacing.m,
  },
  practiceAreaContainer: {
    // marginLeft: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  nearbyAttorneyContainer: {
    // marginHorizontal: theme.spacing.l,
    marginVertical: theme.spacing.m,
  },
  nearbyAttorneyHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: theme.spacing.l,
  },
  locationIconContainer: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.s - 2,
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  locationText: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  txtMessage: {
    fontSize: theme.fontSize.m + 2,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.l,
  },
  imageCont: {
    borderRadius: 60 / 2,
    height: 60,
    width: 60,
    backgroundColor: theme.colors.lightgrey,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  practiceAreaScrollContainer: { marginTop: theme.spacing.s },
  noDataFound: {
    backgroundColor: theme.colors.primaryLightest,
    height: 80,
    borderRadius: theme.borderRadii.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m - 6,
    marginVertical: theme.spacing.m,
    marginHorizontal: theme.spacing.l,
  },
  noDataText: {
    fontSize: theme.fontSize.m - 2,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
  sliderImage: {
    width: 200 * ASPECT_RATIO,
    height: 200 * ASPECT_RATIO,
  },
  meditationCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerMeditationCont: {
    marginHorizontal: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtMeditationView: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.m,
  },
  txtMeditation2: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s - 4,
    fontSize: theme.fontSize.m + 3,
    textAlign: 'center',
  },
  clickHere: {
    textDecorationLine: 'underline',
    marginTop: theme.spacing.s,
    color: theme.colors.yellowStar,
    padding: 10,
  },
}));

export default Home;
