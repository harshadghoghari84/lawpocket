import firestore from '@react-native-firebase/firestore';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import Snackbar from 'react-native-snackbar';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheetRating from 'src/components/BottomSheetRating';
import CustomButton from 'src/components/CustomButton';
import StarIcon from 'src/components/svg/StarIcon';
import { HEIGHT, WIDTH } from 'src/constants';
import constants, { UserType, USER_COLLECTION } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useUserById } from 'src/hooks/useUserById';
import { MainNavigationProps } from 'src/types/navigation.types';
import { getData, setData } from 'src/utils/asyncStorage';
import { FirstCharText } from 'src/utils/common';

// relative path

const LawyerProfile: React.FC<MainNavigationProps<Route.navLawyersProfile>> = ({
  route: {
    params: { item },
  },
  navigation,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const isFocus = useIsFocused();
  const { data: currentUser } = useMeQuery();
  const { data: cUser } = useUserById(item.id);
  // const modalizeRef = React.useRef<Modalize>(null);
  // const { data: areaOfLawData } = useAreaOfLaw();

  const [defaultRating] = React.useState<number>(2);
  const [maxRating] = React.useState<number[]>([1, 2, 3, 4, 5]);
  const modalizeRefActiveRate = React.useRef<Modalize>(null);

  const createChat = (chatId: string, users: any) => {
    firestore()
      .collection(USER_COLLECTION)
      .doc(chatId)
      .set(users)
      .then(() => {});

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
              data: {
                id: item.id,
                name:
                  item?.firstName && item?.lastName
                    ? `${item?.firstName} ${item?.lastName}`
                    : item?.firstName
                    ? `${item?.firstName}`
                    : item?.lastName
                    ? `${item?.lastName}`
                    : '',
                profile: item.profilePhoto,
                userType: UserType.ATTORNEY,
              },
              cUser: cUser,
            },
          },
        ],
      }),
    );
  };

  const onChatPress = async () => {
    try {
      let chatId =
        currentUser?.userType === UserType.CLIENT ||
        currentUser?.userType === UserType.LAW_STUDENT
          ? `${currentUser?.id}-${item.id}`
          : `${item.id}-${currentUser?.id}`;
      // console.log('chatId', chatId);
      const user1 = await firestore()
        .collection(USER_COLLECTION)
        .doc(chatId)
        .get();

      let users = {
        user: [
          {
            id: item.id,
            name:
              item?.firstName && item?.lastName
                ? `${item?.firstName} ${item?.lastName}`
                : item?.firstName
                ? `${item?.firstName}`
                : item?.lastName
                ? `${item?.lastName}`
                : '',
            profilePhoto: item.profilePhoto,
            userType: UserType.ATTORNEY,
          },
          {
            id: currentUser?.id,
            name:
              currentUser?.firstName && currentUser?.lastName
                ? `${currentUser?.firstName} ${currentUser?.lastName}`
                : currentUser?.firstName
                ? `${currentUser?.firstName}`
                : currentUser?.lastName
                ? `${currentUser?.lastName}`
                : '',
            profilePhoto: currentUser?.profilePhoto,
            userType: currentUser?.userType,
          },
        ],
      };
      if (user1.exists) {
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
                  id: item.id,
                },
              },
            ],
          }),
        );
      } else {
        console.log('inside', currentUser?.subscription);
        if (currentUser?.subscription !== null) {
          if (currentUser?.subscription.attorneyCount < 0) {
            createChat(chatId, users);
          } else {
            let count = await getData(constants.chatCount);
            if (count) {
              console.log('count_____', count);
              if (count < currentUser?.subscription.attorneyCount) {
                createChat(chatId, users);
                setData(
                  constants.chatCount,
                  JSON.stringify(parseInt(count) + 1),
                );
              } else {
                Snackbar.show({
                  text: 'Please upgrade your plan to more chat',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: theme.colors.grey5,
                  textColor: theme.colors.black,
                });
              }
            } else {
              console.log('in else_______');
              setData(constants.chatCount, JSON.stringify(1));
              createChat(chatId, users);
            }
          }
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

  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      {isFocus && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.primary}
        />
      )}
      <View style={styles.header}>
        <Entypo
          name="chevron-left"
          size={30}
          color={theme.colors.white}
          onPress={() => navigation.goBack()}
        />
        {/* <Text style={styles.txtMyProfile}>Lawyer Profile</Text> */}
        <Text style={styles.txtMyProfile}>Share</Text>
        {/* <Entypo
          name="share"
          size={22}
          color={theme.colors.white}
          style={styles.btnShare}
          onPress={() => {}}
        /> */}
      </View>
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContStyle}
      >
        <View style={styles.topLgCont}>
          <LinearGradient
            style={styles.topLgCont}
            start={{ x: 0.3, y: 0.3 }}
            colors={[theme.colors.gradientPrime, theme.colors.gradientSecond]}
          >
            <View style={styles.linearGradientInnerCont}>
              <View
                // activeOpacity={0.6}
                // onPress={() => modalizeRef.current?.open()}
                style={styles.addPhotoCont}
              >
                {/* <View style={styles.addPhotoContInner}> */}
                {item?.profilePhoto ? (
                  <Image
                    source={{ uri: item.profilePhoto }}
                    style={styles.imageCont}
                  />
                ) : (
                  <>
                    <Text style={styles.txtName}>
                      {FirstCharText(
                        item?.firstName && item?.lastName
                          ? `${item?.firstName} ${item?.lastName}`
                          : item?.firstName
                          ? `${item?.firstName}`
                          : item?.lastName
                          ? `${item?.lastName}`
                          : '',
                      )}
                    </Text>
                  </>
                )}
                <View style={styles.userActiveCont} />
                {/* </View> */}
              </View>

              <Text style={styles.txtUserName}>
                {item?.firstName && item?.lastName
                  ? `${item?.firstName} ${item?.lastName}`
                  : item?.firstName
                  ? `${item?.firstName}`
                  : item?.lastName
                  ? `${item?.lastName}`
                  : ''}
              </Text>
              <View style={styles.ratingCont}>
                {maxRating.map((itm: number) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={itm}
                      // onPress={() => setDefaultRating(itm)}
                    >
                      <StarIcon
                        height={16}
                        width={16}
                        color={
                          itm <= defaultRating
                            ? theme.colors.white
                            : theme.colors.white1
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
                <Text style={styles.txt20}>{'(20)'}</Text>
              </View>
            </View>
            <View style={styles.editProfileCont}>
              <CustomButton
                name={'Chat'}
                height={40}
                smallBtn={WIDTH / 3}
                bgc={theme.colors.white}
                txtColor={theme.colors.black}
                icon={
                  <MaterialIcons
                    name="chat"
                    color={theme.colors.primary}
                    size={18}
                    style={styles.editIcon}
                  />
                }
                onPress={() => onChatPress()}
              />
              <CustomButton
                name={'Call'}
                height={40}
                smallBtn={WIDTH / 3}
                bgc={theme.colors.white}
                txtColor={theme.colors.black}
                icon={
                  <MaterialIcons
                    name="call"
                    color={theme.colors.primary}
                    style={styles.editIcon}
                    size={20}
                  />
                }
                onPress={() => {}}
              />
            </View>
            <View style={styles.lgBottomView}>
              <View style={styles.bmItemCont}>
                <View style={styles.iconWithNameCont}>
                  <Icon
                    name="location-sharp"
                    size={20}
                    color={theme.colors.white}
                  />
                  <Text style={styles.txtState}>{item.city}</Text>
                </View>
              </View>
              {item?.userPracticeArea.length > 0 && (
                <View style={styles.bmItemCont}>
                  <View style={styles.iconWithNameCont}>
                    <Entypo
                      name="briefcase"
                      size={15}
                      color={theme.colors.white}
                      style={styles.iconBriefcase}
                    />
                    <Text style={styles.txtPracticeArea}>
                      {item?.userPracticeArea.length}
                    </Text>
                    {/* {item?.userPracticeArea.map(area => {
                      return (
                        <>
                          {areaOfLawData?.map(ele => {
                            if (ele.id === area) {
                              return (
                                <Text
                                  key={ele.id}
                                  style={styles.txtSelectedItm}>
                                  {ele.label}
                                </Text>
                              );
                            }
                          })}
                        </>
                      );
                    })} */}
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
        {/* <View style={styles.cont2}>
          <View style={styles.totalCaseCont}>
            <Text style={styles.txtTotalCase1}>Total Completed case</Text>
            <Text style={styles.txtTotalCase2}>20</Text>
          </View>
          <View style={styles.totalWorkedCont}>
            <Text style={styles.txtTotalHour1}>Total Worked Hours</Text>
            <Text style={styles.txtTotalHour2}>214 hrs</Text>
          </View>
        </View>
        <Divider /> */}
        {/* <View style={styles.cont3}>
          <SettingItem
            icon={
              <FontAwesome5
                name="th-list"
                size={20}
                color={theme.colors.grey}
                // style={styles.iconStyle}
              />
            }
            name={'Post'}
            data={'7 Post'}
            onPress={() => {}}
          />
        </View>
        <Divider /> */}
        {/* <View style={styles.recentChatCont}>
          <ViewAllItemCont
            name={'Reviews'}
            dataLength={`${ReviewsData.length}`}
            onPress={() => {
              navigation.navigate(Route.navReviewsScreen);
            }}
          />
          {ReviewsData.map(items => {
            return <ReviewItem item={items} />;
          })}
        </View> */}
      </ScrollView>
      <View style={styles.signOutCont}>
        <CustomButton
          name="Write review"
          borderBtn={true}
          onPress={() => {
            // modalizeRefActiveRate.current?.open();
          }}
          icon={
            <Fontisto
              name="plus-a"
              size={18}
              color={theme.colors.iconColor}
              style={{ marginRight: theme.spacing.m - 6 }}
            />
          }
        />
      </View>

      <SafeAreaView style={styles.bottomSafeAreaView} />
      <BottomSheetRating
        modalizeRef={modalizeRefActiveRate}
        // defaultRating={defaultRating}
        // maxRating={maxRating}
        // setDefaultRating={setDefaultRating}
        name={
          item?.firstName && item?.lastName
            ? `${item?.firstName} ${item?.lastName}`
            : item?.firstName
            ? `${item?.firstName}`
            : item?.lastName
            ? `${item?.lastName}`
            : ''
        }
        profile={item.profilePhoto}
        userType={UserType.ATTORNEY}
      />
    </>
  );
};

export default LawyerProfile;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
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
    height: 50,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.m - 6,
    paddingRight: theme.spacing.l - 4,
  },
  txtMyProfile: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.white,
    fontWeight: '600',
  },
  openCameraCont: {
    padding: theme.spacing.s - 3,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadii.l,
    position: 'absolute',
    top: 5,
    right: 0,
    zIndex: 999,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  addPhotoCont: {
    height: 130,
    width: 130,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  addPhotoContInner: {
    height: 120,
    width: 120,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCont: {
    borderRadius: theme.borderRadii.xxl + 50,
    height: 120,
    width: 120,
    resizeMode: 'cover',
  },
  txtName: {
    fontSize: theme.fontSize.xl,
    fontWeight: '500',
    color: theme.colors.white,
  },
  txtUserName: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    color: theme.colors.white,
    marginTop: theme.spacing.m - 6,
  },

  ratingCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: theme.spacing.m - 6,
  },
  txt20: {
    fontSize: theme.fontSize.m,
    color: theme.colors.white,
    marginLeft: theme.spacing.m - 6 - 5,
  },
  cont2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.l - 4,
  },
  totalCaseCont: {
    flex: 1,
  },
  totalWorkedCont: {
    flex: 1,
  },
  scrollContStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.l * 3,
  },
  txtTotalCase2: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtTotalHour2: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtTotalCase1: {
    fontSize: theme.fontSize.m - 3,
    color: theme.colors.textSecondary,
  },
  txtTotalHour1: {
    fontSize: theme.fontSize.m - 3,
    color: theme.colors.textSecondary,
  },
  cont3: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  iconStyle: {
    paddingHorizontal: theme.spacing.m,
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
    paddingBottom: theme.spacing.s,
    backgroundColor: theme.colors.background,
  },
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
  },
  qrModalCont: {
    backgroundColor: theme.colors.background,
    height: HEIGHT / 1.5,

    paddingHorizontal: theme.spacing.l - 4,
  },
  headerQrModal: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
  },
  txtQrCode: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    color: theme.colors.black,
  },
  qrModalDummyView: {
    width: 30,
  },
  qrCont: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

    marginVertical: theme.spacing.l,
  },
  btnShare: {
    marginRight: theme.spacing.m - 6,
  },
  txtLawPocket: {
    fontSize: theme.fontSize.l,
    marginBottom: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  editProfileCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: theme.spacing.l - 4,
  },
  editIcon: { marginRight: theme.spacing.m - 8 },
  linearGradientInnerCont: { flex: 1, alignItems: 'center' },
  imgQrCode: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
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
  recentChatCont: {
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.m,
  },
  lgBottomView: {
    marginHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m + 4,
  },
  bmItemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  iconWithNameCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtRegion: {
    color: theme.colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.s,
  },
  txtState: {
    marginLeft: theme.spacing.s,
    color: theme.colors.white,
    fontWeight: '600',
  },
  txtPracticeArea: {
    marginLeft: theme.spacing.s,
    color: theme.colors.white,
    fontWeight: '600',
  },
  iconBriefcase: {
    marginLeft: theme.spacing.s - 3,
  },
  bmItemPracticeDataCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtStateMoreStyle: { fontWeight: '700', marginRight: theme.spacing.s - 3 },
  txtSelectedItm: {
    color: theme.colors.grey,
    marginHorizontal: theme.spacing.s,
  },
}));
