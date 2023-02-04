import firestore from '@react-native-firebase/firestore';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, makeStyles, useTheme } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomSheetRating from 'src/components/BottomSheetRating';
import CustomButton from 'src/components/CustomButton';
import { Divider } from 'src/components/Divider';
import ReviewItem from 'src/components/ReviewItem';
import SettingItem from 'src/components/SettingItem';
import BackIcon from 'src/components/svg/BackIcon';
import ShareIcon from 'src/components/svg/ShareIcon';
import StarIcon from 'src/components/svg/StarIcon';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { ViewAllItemCont } from 'src/components/ViewAllItemCont';
import { WIDTH } from 'src/constants';
import { UserType, USER_COLLECTION } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useUserById } from 'src/hooks/useUserById';
import { blockUser } from 'src/redux/blockUser/blockUser.thunk';
import { createChat } from 'src/redux/chat/chat.thunk';
import { markAsClient } from 'src/redux/myCustomer/myCustomer.thunk';
import { MainNavigationProps } from 'src/types/navigation.types';
import { RateReviewDataProps } from 'src/types/reviewrate.types';
import { PracticeArea } from 'src/types/user.types';
import { FirstCharText, onShare } from 'src/utils/common';
import RNBootSplash from 'react-native-bootsplash';
import { ThemeProps } from 'src/types/global.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// relative path
const STAR = [1, 2, 3, 4, 5];

const getPracticeArea = (data: PracticeArea[]) => {
  let finalPracticeArea: string = '';
  data.map(i => {
    if (finalPracticeArea.length > 0) {
      finalPracticeArea = finalPracticeArea + ', ' + i.name;
    } else {
      finalPracticeArea = i.name;
    }
  });

  return finalPracticeArea;
};

const userIsAttorney = (userType: number) => {
  return (
    userType === UserType.ATTORNEY ||
    userType === UserType.LAW_FIRM ||
    userType === UserType.LEGAL_SERVICE_PROVIDER
  );
};

const OtherUserProfile: React.FC<
  MainNavigationProps<Route.navOtherUserProfile>
> = ({ navigation, route }) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const isFocus = useIsFocused();
  const dispatch = useAppDispatch();
  const { data: currentUser, isLoading: currentUserLoading } = useMeQuery();

  const {
    data: userInfo,
    refetch: reFetchUserInfo,
    isLoading,
    error: userInfoError,
  } = useUserById(id);

  React.useEffect(() => {
    const Init = async () => {
      await RNBootSplash.hide();
    };

    Init().then();
  }, []);

  // console.log('currentUser', currentUser);
  console.log('userInfo', userInfo);
  console.log('userInfo error', userInfoError);

  const [image, setImage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  const modalizeRefActiveRate = React.useRef<Modalize>(null);

  //API response use =----------->
  const userRate: number = userInfo?.avgRating || 0;
  const reviews: RateReviewDataProps[] = userInfo?.review || [];
  const practiceArea: string = getPracticeArea(
    userInfo?.userPracticeArea || [],
  );
  const sharedFileCount: number = userInfo?.sharedFileCount || 0;
  const reviewCount: number = userInfo?.reviewCount || 0;
  const isAttorney = userIsAttorney(userInfo?.userType);

  const userName =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo?.firstName} ${userInfo?.lastName}`
      : userInfo?.firstName
      ? `${userInfo?.firstName}`
      : userInfo?.lastName
      ? `${userInfo?.lastName}`
      : '';

  let totalChatCount =
    currentUser?.activeChatCount + currentUser?.inActiveChatCount;
  //  End API use =------>

  React.useEffect(() => {
    if (userInfo) {
      setImage(userInfo?.profilePhoto ? userInfo?.profilePhoto : '');
    }
  }, [userInfo]);

  const onPressBlock = async () => {
    setLoading(true);
    const result = await dispatch(
      blockUser({
        forUser: id,
      }),
    );
    if (blockUser.fulfilled.match(result)) {
      // updateUser();
      setLoading(false);
      navigation.navigate({
        name: Route.navChat as never,
        params: {} as never,
      });
    } else {
      setLoading(false);
    }
  };

  // const updateUser = () => {
  //   let userUpdt: { user: users[] } = {
  //     user: [],
  //   };

  //   firestore()
  //     .collection(USER_COLLECTION)
  //     .doc(chatID)
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.data().user.map((flt: any) => {
  //         userUpdt.user.push({ ...flt, blockedUser: true });
  //       });
  //       firestore()
  //         .collection(USER_COLLECTION)
  //         .doc(chatID)
  //         .set(userUpdt, { merge: true })
  //         .then(() => {
  //           setLoading(false);
  //           navigation.navigate({
  //             name: Route.navChat as never,
  //             params: {} as never,
  //           });
  //         });
  //     });
  // };

  const createNewChat = async (CHAT_ID: string) => {
    console.log('CHAT_ID', CHAT_ID);
    let users = {
      attorneyId: id,
      clientId: currentUser?.id,
    };
    setLoader(true);
    try {
      firestore()
        .collection(USER_COLLECTION)
        .doc(CHAT_ID)
        .set(users)
        .then(async () => {
          const result = await dispatch(
            createChat({ attorney: userInfo?.id, fireConsole: CHAT_ID }),
          );

          console.log('create chat result', result);
          if (createChat.fulfilled.match(result)) {
            setLoader(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: Route.navDashboard,
                    state: {
                      routes: [{ name: Route.navChat }],
                    },
                  },
                  {
                    name: Route.navChatRoom,
                    params: {
                      sender_id: id,
                      fireConsole: CHAT_ID,
                    },
                  },
                ],
              }),
            );
          } else {
            setLoader(false);
          }
        });
    } catch (error) {
      setLoader(false);

      console.log(error);
    }
  };

  const onChatPress = async () => {
    try {
      if (userInfo?.activeChat) {
        //   const user1 = await firestore()
        // .collection(USER_COLLECTION)
        // .doc(userInfo?.activeChat)
        // .get();
        console.log('inside');

        if (
          userInfo?.userType === UserType.CLIENT ||
          userInfo?.userType === UserType.LAW_STUDENT
        ) {
          navigation.goBack();
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: Route.navDashboard,
                  state: {
                    routes: [{ name: Route.navChat }],
                  },
                },
                {
                  name: Route.navChatRoom,
                  params: {
                    sender_id: id,
                    fireConsole: userInfo?.activeChat,
                  },
                },
              ],
            }),
          );
        }
      } else {
        let CHAT_ID = (Math.random() + 1).toString(36).substring(2);

        if (currentUser?.subscription !== null) {
          if (currentUser?.subscription?.attorneyCount < 0) {
            createNewChat(CHAT_ID);
          } else {
            if (totalChatCount !== null) {
              if (totalChatCount < currentUser?.subscription?.attorneyCount) {
                createNewChat(CHAT_ID);
              } else {
                Snackbar.show({
                  text: 'Please upgrade your plan for more chat!',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: theme.colors.grey5,
                  textColor: theme.colors.black,
                });
              }
            }
          }
        } else {
          Snackbar.show({
            text: "You don't have any subscription!",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: theme.colors.error,
            textColor: theme.colors.white,
          });
        }
      }
    } catch (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };

  const openDocument = () => {
    navigation.navigate(Route.navStorage, { activeAdd: false });
  };

  const writeReview = () => {
    modalizeRefActiveRate.current?.open();
  };

  const manageMarkAsClient = async () => {
    const result = await dispatch(
      markAsClient({
        client: id,
      }),
    );

    if (markAsClient.fulfilled.match(result)) {
      reFetchUserInfo().then();
      Snackbar.show({
        text: result.payload,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.success,
        textColor: theme.colors.white,
      });
    }
  };

  return (
    <>
      {/* <SafeAreaView style={styles.topSafeAreaView} /> */}
      {isFocus && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.primary}
        />
      )}
      {userInfoError || currentUserLoading || isLoading ? (
        <NoDataFound
          loading={currentUserLoading || isLoading}
          noDataText={'No data found!'}
          isHeader={true}
          noDataIcon={
            <Image
              source={require('src/helper/image/noData.png')}
              style={styles.noDataIcons}
            />
          }
        />
      ) : (
        <>
          <View style={styles.mainCont}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backBtnCont}
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {
                            name: Route.navDashboard,
                          },
                        ],
                      }),
                    );
                  }
                }}
              >
                <BackIcon color={theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Block User',
                    `Do you wants to block ${userName}`,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      { text: 'OK', onPress: () => onPressBlock() },
                    ],
                  );
                }}
                activeOpacity={0.6}
                style={styles.blockCont}
              >
                <Text style={styles.txtBlock}>
                  {loading ? (
                    <ActivityIndicator color={theme.colors.white} />
                  ) : (
                    'Block'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              refreshControl={
                <RefreshControl
                  tintColor={theme.colors.white}
                  refreshing={isLoading}
                  onRefresh={() => reFetchUserInfo().then()}
                  style={styles.refreshControl}
                />
              }
              contentContainerStyle={styles.scrollContStyle}
            >
              <LinearGradient
                style={styles.topLgCont}
                start={{ x: 0.5, y: 0.5 }}
                colors={[
                  theme.colors.gradientPrime,
                  theme.colors.gradientSecond,
                ]}
              >
                <View style={styles.innerLgCont}>
                  <View
                    style={[
                      styles.addPhotoCont,
                      {
                        backgroundColor:
                          userInfo?.myClient === 1
                            ? theme.colors.royalBlue
                            : theme.colors.black1,
                      },
                    ]}
                  >
                    <View style={styles.addPhotoContInner}>
                      {image !== '' ? (
                        <Image
                          source={{ uri: image }}
                          style={[styles.imageCont]}
                        />
                      ) : (
                        <>
                          <Text style={styles.txtName}>
                            {FirstCharText(userName)}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Text style={styles.txtUserName}>{userName}</Text>
                  <View style={styles.startContainer}>
                    {STAR.map(item => {
                      return (
                        <StarIcon
                          height={18}
                          width={18}
                          color={
                            item <= userRate
                              ? theme.colors.yellowStar
                              : theme.colors.grey4
                          }
                          style={styles.starIcon}
                        />
                      );
                    })}
                    <Text
                      style={styles.txtReviewCount}
                    >{`(${reviewCount})`}</Text>
                  </View>
                  {userInfo?.userType === UserType.CLIENT ||
                  userInfo?.userType === UserType.LAW_STUDENT ? null : (
                    <View style={styles.shareBtnContainer}>
                      <TouchableOpacity
                        disabled={loader}
                        activeOpacity={1}
                        onPress={() => onChatPress()}
                      >
                        <View style={styles.shareBtn}>
                          {loader ? (
                            <ActivityIndicator />
                          ) : (
                            <>
                              <Icon
                                size={18}
                                name="message-text"
                                type="material-community"
                                color={theme.colors.primary}
                                tvParallaxProperties={undefined}
                              />
                              <Text style={styles.chatBtnText}>Chat</Text>
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.btnShare}
                        onPress={() => onShare(`${userInfo?.id}`)}
                      >
                        <View style={styles.shareBtn}>
                          <ShareIcon
                            color={theme.colors.primary}
                            height={16}
                            width={16}
                          />
                          <Text style={styles.chatBtnText}>Share</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  {isAttorney && (
                    <View style={styles.locationContainer}>
                      <View style={styles.locationView}>
                        <Icon
                          size={18}
                          name="location-sharp"
                          type={'ionicon'}
                          color={theme.colors.white}
                          tvParallaxProperties={undefined}
                        />
                        <Text style={styles.locationText}>
                          {userInfo?.state || ''}
                        </Text>
                      </View>
                      <View style={styles.locationView}>
                        <FontAwesome5
                          size={16}
                          name="briefcase"
                          color={theme.colors.white}
                        />
                        <Text style={styles.locationText}>{practiceArea}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </LinearGradient>

              <View style={styles.cont3}>
                {!isAttorney && (
                  <View>
                    <SettingItem
                      icon={
                        <FontAwesome5
                          name="th-list"
                          size={20}
                          color={theme.colors.grey}
                        />
                      }
                      name={'Documents'}
                      data={`${sharedFileCount.toString()} ${
                        sharedFileCount > 1 ? 'items' : 'item'
                      }`}
                      viewContainer={styles.settingItemView}
                      onPress={openDocument}
                    />
                    <SettingItem
                      icon={
                        <Icon
                          name="location-sharp"
                          size={20}
                          type={'ionicon'}
                          color={theme.colors.grey}
                          tvParallaxProperties={undefined}
                        />
                      }
                      name={userInfo?.state || ''}
                      onlyShowData={true}
                      viewContainer={styles.settingItemView}
                    />
                    <SettingItem
                      icon={
                        <Feather
                          name="users"
                          size={20}
                          color={theme.colors.grey}
                        />
                      }
                      name={practiceArea}
                      onlyShowData={true}
                      viewContainer={styles.settingItemView}
                    />
                  </View>
                )}
                {reviews.length > 0 && (
                  <View>
                    <Divider style={styles.divider} />
                    <ViewAllItemCont
                      name={`Reviews (${reviewCount.toString()})`}
                      style={styles.viewAllCont}
                      onPress={() => {
                        navigation.navigate(Route.navReviewsScreen);
                        navigation.navigate({
                          name: Route.navReviewsScreen as never,
                          params: { userId: userInfo?.id } as never,
                        });
                      }}
                    />
                    {reviews.map(item => {
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
                )}
              </View>
            </ScrollView>
            <View style={styles.signOutCont}>
              {userInfo?.allowedToRate && (
                <View style={styles.btnContainer}>
                  <CustomButton
                    name="Write review"
                    borderBtn={true}
                    icon={
                      <Icon
                        name="add"
                        size={20}
                        type={'ionicon'}
                        color={theme.colors.grey}
                        tvParallaxProperties={undefined}
                      />
                    }
                    onPress={writeReview}
                  />
                </View>
              )}
              {/* {userInfo?.allowedToRate && !isAttorney && (
              <View style={styles.allowRateCont} />
            )} */}
              {userInfo?.myClient === 2 && !isAttorney && (
                <View
                  style={[styles.btnContainer, { marginLeft: theme.spacing.s }]}
                >
                  <CustomButton
                    name="Mark as Client"
                    onPress={manageMarkAsClient}
                  />
                </View>
              )}
            </View>
          </View>
        </>
      )}
      <BottomSheetRating
        modalizeRef={modalizeRefActiveRate}
        name={userName}
        profile={userInfo?.profilePhoto}
        uid={id}
        userType={userInfo?.userType}
        navigationDisable={true}
      />
      {/* <SafeAreaView style={styles.bottomSafeAreaView} /> */}
    </>
  );
};

export default OtherUserProfile;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  mainCont: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    // paddingTop: props.insets.top + theme.spacing.s,
    paddingBottom: props.insets.bottom,
  },
  topLgCont: {
    width: WIDTH,
    // height: WIDTH - 50,
    borderBottomLeftRadius: theme.borderRadii.l,
    borderBottomRightRadius: theme.borderRadii.l,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 4,
      },
    }),
    backgroundColor: theme.colors.transparent,
    paddingBottom: theme.spacing.l - 4 * 2,
  },
  bottomSafeAreaView: {
    flex: 0,
    backgroundColor: theme.colors.background,
  },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors.primary,
  },
  header: {
    // height: 40,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m - 6,

    paddingTop: props.insets.top + theme.spacing.s,
    // paddingBottom: props.insets.bottom + theme.spacing.s,
  },

  userActiveCont: {
    padding: 8,
    backgroundColor: theme.colors.greenLight,
    borderRadius: theme.borderRadii.l,
    borderColor: theme.colors.white,
    borderWidth: 2,
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 999,
  },
  addPhotoCont: {
    height: 150,
    width: 150,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  addPhotoContInner: {
    height: 140,
    width: 140,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCont: {
    borderRadius: 140 / 2,
    height: 140,
    width: 140,
    resizeMode: 'cover',
  },
  txtName: {
    fontSize: theme.fontSize.xl,
    fontWeight: '500',
    color: theme.colors.white,
  },
  txtUserName: {
    fontSize: theme.fontSize.m + 5,
    fontWeight: '500',
    color: theme.colors.white,
    marginTop: theme.spacing.m - 6,
  },
  txtReviewCount: {
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    color: theme.colors.white,
  },
  startContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.s,
  },
  scrollContStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.l,
  },
  cont3: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  iconStyle: {
    paddingHorizontal: theme.spacing.m - 6 + 5,
    marginTop: theme.spacing.m - 6 + 2,
  },
  txtItemName: {
    fontSize: theme.fontSize.m,
    marginLeft: theme.spacing.m - 6,
    color: theme.colors.black,
  },
  txtItemData: {
    fontSize: theme.fontSize.m,
    marginRight: theme.spacing.m - 6,
    color: theme.colors.primary,
  },
  itemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    marginVertical: theme.spacing.l - 4,
  },
  innerItmCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutCont: {
    paddingHorizontal: theme.spacing.l - 4,
    marginBottom: theme.spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  blockCont: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  txtBlock: {
    color: theme.colors.white,
    fontSize: theme.fontSize.m + 2,
    fontWeight: '500',
  },
  txtOnlyData: {
    color: theme.colors.black,
  },
  innerLgCont: { flex: 1, alignItems: 'center' },
  backBtnCont: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  viewAllCont: { paddingHorizontal: theme.spacing.l - 4 },
  divider: {
    height: 1,
    marginVertical: theme.spacing.m - 2,
    width: '95%',
    alignSelf: 'center',
  },
  starIcon: { marginRight: 5 },
  chatBtnText: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    color: theme.colors.black,
    marginLeft: theme.spacing.s,
  },
  shareBtnContainer: { flexDirection: 'row', paddingVertical: 15 },
  shareBtn: {
    width: 100,
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  spacingView: { width: 30, height: 1 },
  locationText: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    color: theme.colors.white,
    marginLeft: theme.spacing.s,
  },
  locationContainer: {
    paddingVertical: theme.spacing.s,
    width: '90%',
  },
  locationView: {
    flexDirection: 'row',
    marginVertical: theme.spacing.s - 2,
  },
  settingItemView: { marginVertical: theme.spacing.m },
  btnContainer: { flex: 1 },
  clientTag: {
    width: 85,
    height: 35,
    position: 'absolute',
    bottom: 14,
  },
  allowRateCont: { flex: 0.5 },
  btnShare: {
    marginLeft: theme.spacing.s,
  },
  refreshControl: {
    backgroundColor: theme.colors.primary,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));
