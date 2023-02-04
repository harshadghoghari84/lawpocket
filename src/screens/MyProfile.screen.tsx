import { CommonActions, useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { makeStyles, useTheme } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Snackbar from 'react-native-snackbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useQueryClient } from 'react-query';
import ModalFooter from 'src/components/BottomSheetFooter';
import ModalHeader from 'src/components/BottomSheetHeader';
import CustomButton from 'src/components/CustomButton';
import SettingItem from 'src/components/SettingItem';
import BackIcon from 'src/components/svg/BackIcon';
import EditIcon from 'src/components/svg/EditIcon';
import FeedsIcon from 'src/components/svg/FeedsIcon';
import StarIcon from 'src/components/svg/StarIcon';
import { HEIGHT, WIDTH } from 'src/constants';
import constants, { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useBlockedUsers } from 'src/hooks/useBlockedUserList';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useRateReview } from 'src/hooks/useRateReviewList';
import { logout } from 'src/redux/authentication/authentication.thunks';
import { updateProfilePhoto } from 'src/redux/updateProfile/updateProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { MainNavigationProps } from 'src/types/navigation.types';
import { deleteData } from 'src/utils/asyncStorage';
import { FirstCharText, getUrlExtension, onShare } from 'src/utils/common';
import { useEffect, useState } from 'react';
import {
  setSelectedFeedId,
  sharedFiles,
} from 'src/redux/settings/settings.slice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProps } from 'src/types/global.types';

// relative path

interface FormDataProps {
  name: string;
  type: string;
  uri: string;
}

const MyProfile: React.FC<MainNavigationProps<Route.navMyProfileScreen>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const isFocus = useIsFocused();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const {
    modalizeCont,
    openPickerCont,
    txtModalText,
    modalDividerCont,
    modalizeCancelBtn,
    fontBold,
  } = commonStyles();

  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeRefQrCode = React.useRef<Modalize>(null);

  const { data: currentUser, refetch, isRefetching } = useMeQuery();
  const { data } = useRateReview();
  const { data: BlokedUserData, refetch: reFetchBlockUserData } =
    useBlockedUsers();
  const [image, setImage] = React.useState([]);
  const [maxRating] = React.useState<number[]>([1, 2, 3, 4, 5]);
  const [activeVideo] = React.useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const [defaultRating, setDefaultRating] = React.useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    setDefaultRating(currentUser?.avgRating ? currentUser.avgRating : 0);
  }, [currentUser]);

  const openPickerCamera = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Law-Pocket Photo App Camera Permission',
            message: 'Law-Pocket Photo App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (activeVideo) {
            ImagePicker.openCamera({ mediaType: 'video' }).then(images => {
              // setImage([...image, { img: images.path }]);
              let obj = {
                name: images.filename ? images.filename : '',
                type: images.mime,
                uri: images.path,
              };
              uploadFiles([obj]);
            });
          } else {
            ImagePicker.openCamera({}).then(images => {
              // setImage([...image, { img: images.path }]);
              let obj = {
                name: images.filename ? images.filename : '',
                type: images.mime,
                uri: images.path,
              };
              uploadFiles([obj]);
            });
          }
        } else {
          Snackbar.show({
            text: 'Camera permission denied',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: theme.colors.grey5,
            textColor: theme.colors.black,
          });
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      if (activeVideo) {
        ImagePicker.openCamera({ mediaType: 'video' }).then(images => {
          // setImage([...image, { img: images.path }]);
          let obj = {
            name: images.filename ? images.filename : '',
            type: images.mime,
            uri: images.path,
          };
          uploadFiles([obj]);
        });
      } else {
        ImagePicker.openCamera({}).then(images => {
          let obj = {
            name: images.filename ? images.filename : '',
            type: images.mime,
            uri: images.path,
          };
          uploadFiles([obj]);

          // setImage([obj]);
        });
      }
    }
  };

  const openPicker = () => {
    if (activeVideo) {
      ImagePicker.openPicker({ mediaType: 'video', multiple: true }).then(
        images => {
          let arr = [];

          for (let i = 0; i < images.length; i++) {
            arr.push({ img: images[i].path });
          }

          setImage([...image, ...arr]);
        },
      );
    } else {
      pickImage();
    }
  };

  const openPickerPhotos = () => {
    ImagePicker.openPicker({ mediaType: 'photo' }).then(images => {
      console.log('images', images);
      let obj = {
        name: images.filename ? images.filename : '',
        type: images.mime,
        uri: images.path,
      };
      uploadFiles([obj]);

      // setImage([obj]);
    });
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      if (res.length) {
        // setImage(res);
        uploadFiles(res);
      }
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
      } else {
        console.log('catch err', e);
      }
    }
  };

  const uploadFiles = async (res: FormDataProps[]) => {
    const formData = new FormData();
    Object.entries(res).forEach(([_key, val]) => {
      formData.append('profilePhoto', {
        name: val.name || `${new Date()}.${getUrlExtension(val.uri)}`,
        type: val.type,
        uri: Platform.OS === 'ios' ? val.uri.replace('file://', '') : val.uri,
      });
    });

    const result = await dispatch(updateProfilePhoto(formData));

    if (updateProfilePhoto.fulfilled.match(result)) {
      refetch().then();
    } else {
    }
  };

  const pullToRefreshData = () => {
    setRefreshing(true);
    reFetchBlockUserData().then();
    refetch().then();
  };

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing, isRefetching]);

  return (
    <>
      {isFocus && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.primary}
        />
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtnCont}
            onPress={() => navigation.goBack()}
          >
            <BackIcon color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.txtMyProfile}>My Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(Route.navSetting)}
            activeOpacity={0.6}
            style={styles.iconSetting}
          >
            <Icon name="settings" size={25} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={theme.colors.white}
              onRefresh={pullToRefreshData}
              style={styles.refreshControl}
            />
          }
          // bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.scrollContStyle}
        >
          <LinearGradient
            style={styles.topLgCont}
            start={{ x: 0.3, y: 0.3 }}
            colors={[theme.colors.gradientPrime, theme.colors.gradientSecond]}
          >
            <View style={styles.linearGradientInnerCont}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => modalizeRef.current?.open()}
                style={styles.addPhotoCont}
              >
                <View style={styles.addPhotoContInner}>
                  {currentUser?.profilePhoto ? (
                    <Image
                      onLoadStart={() => setImageLoaded(true)}
                      onLoadEnd={() => setImageLoaded(false)}
                      source={{
                        uri: currentUser.profilePhoto,
                      }}
                      style={styles.imageCont}
                    />
                  ) : (
                    <Text style={styles.txtName}>
                      {FirstCharText(
                        currentUser?.firstName && currentUser?.lastName
                          ? `${currentUser?.firstName} ${currentUser?.lastName}`
                          : currentUser?.firstName
                          ? `${currentUser?.firstName}`
                          : currentUser?.lastName
                          ? `${currentUser?.lastName}`
                          : '',
                      )}
                    </Text>
                  )}
                  {imageLoaded && (
                    <ActivityIndicator
                      color={theme.colors.white}
                      style={styles.indicatorView}
                    />
                  )}
                  <View style={styles.openCameraCont}>
                    <EditIcon
                      color={theme.colors.primary}
                      height={14}
                      width={14}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={styles.txtUserName}>
                {currentUser?.firstName && currentUser?.lastName
                  ? `${currentUser?.firstName} ${currentUser?.lastName}`
                  : currentUser?.firstName
                  ? `${currentUser?.firstName}`
                  : currentUser?.lastName
                  ? `${currentUser?.lastName}`
                  : ''}
              </Text>
              <View style={styles.ratingCont}>
                {maxRating.map((item: number) => {
                  return (
                    <StarIcon
                      height={16}
                      width={16}
                      color={
                        item <= defaultRating
                          ? theme.colors.white
                          : theme.colors.white1
                      }
                    />
                  );
                })}
                {/* <Text style={styles.txt20}>{'(20)'}</Text> */}
              </View>
            </View>
            <View style={styles.editProfileCont}>
              <CustomButton
                name={'Edit Profile'}
                smallBtn={WIDTH / 2.8}
                bgc={theme.colors.white}
                txtColor={theme.colors.black}
                icon={
                  <EditIcon
                    color={theme.colors.primary}
                    style={styles.editIcon}
                  />
                }
                onPress={() => navigation.navigate(Route.navEditProfile)}
              />
            </View>
          </LinearGradient>

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
          <View style={styles.cont3}>
            {currentUser?.userType === UserType.ATTORNEY ||
            currentUser?.userType === UserType.LAW_FIRM ||
            currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER ? (
              <SettingItem
                icon={
                  <Feather
                    name="users"
                    size={20}
                    color={theme.colors.grey}
                    // style={styles.iconStyle}
                  />
                }
                name={'My Customer'}
                rightIconEnable={true}
                onPress={() => navigation.navigate(Route.navMyCustomers)}
              />
            ) : null}
            <SettingItem
              icon={<StarIcon color={theme.colors.grey} />}
              name={`${
                currentUser?.userType === UserType.CLIENT ||
                currentUser?.userType === UserType.LAW_STUDENT
                  ? 'Attorneys'
                  : 'Clients'
              } review`}
              rightIconEnable={true}
              data={`${data?.data ? data?.data?.length : ''}`}
              onPress={() => {
                navigation.navigate({
                  name: Route.navReviewsScreen as never,
                  params: { userId: '' } as never,
                });
              }}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <Entypo
                  name="block"
                  size={20}
                  color={theme.colors.grey}
                  // style={styles.iconStyle}
                />
              }
              name={'Blocked Users'}
              onPress={() => navigation.navigate(Route.navBlockedUser)}
              data={`${BlokedUserData ? BlokedUserData?.length : 0}`}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <Icon name="lock-closed" size={20} color={theme.colors.grey} />
              }
              name={'Change Password'}
              onPress={() => navigation.navigate(Route.navChangePassword)}
            />
            <SettingItem
              rightIconEnable={true}
              icon={<FeedsIcon color={theme.colors.grey} />}
              name={'My Feeds'}
              onPress={() => {
                dispatch(setSelectedFeedId(''));
                navigation.navigate(Route.navMyFeeds);
              }}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <AntDesign
                  name="questioncircle"
                  size={20}
                  color={theme.colors.grey}
                  // style={styles.iconStyle}
                />
              }
              name={'Support & FAQ'}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <MaterialIcons
                  name="call"
                  size={20}
                  color={theme.colors.grey}
                  // style={styles.iconStyle}
                />
              }
              name={'Contact Us'}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <FontAwesome
                  name="qrcode"
                  size={25}
                  color={theme.colors.grey}
                  // style={styles.iconStyle}
                />
              }
              name={'QR Code'}
              onPress={() => modalizeRefQrCode.current?.open()}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <MaterialIcons
                  name="info"
                  size={20}
                  color={theme.colors.grey}
                  // style={styles.iconStyle}
                />
              }
              name={'Privacy Policy'}
            />
            <SettingItem
              rightIconEnable={true}
              icon={
                <MaterialIcons
                  name="event-note"
                  size={20}
                  color={theme.colors.grey}
                  // style={styles.iconStyle}
                />
              }
              name={'Terms of Use'}
            />
          </View>
          <View style={styles.signOutCont}>
            <CustomButton
              name="Sign Out"
              borderBtn={true}
              onPress={async () => {
                await dispatch(logout());
                queryClient.clear();
                deleteData(constants.chatCount);
                dispatch(
                  sharedFiles({
                    pocketData: { lst: [], size: '' },
                    caseData: { lst: [], size: '' },
                  }),
                );
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: Route.navAuthentication }],
                  }),
                );
              }}
              icon={
                <Icon
                  name="power-sharp"
                  size={20}
                  color={theme.colors.iconColor}
                  style={{ marginRight: theme.spacing.m - 6 }}
                />
              }
            />
          </View>
        </ScrollView>
      </View>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRefQrCode}
          scrollViewProps={{
            bounces: false,
            showsVerticalScrollIndicator: false,
          }}
          handlePosition="inside"
          handleStyle={styles.modalHandleStyle}
          FooterComponent={() => (
            <ModalFooter backgroundColor={theme.colors.background} />
          )}
          HeaderComponent={() => <ModalHeader title="QR Code" />}
        >
          <>
            <View style={styles.qrModalCont}>
              <View style={styles.qrCont}>
                <Text style={styles.txtLawPocket}>LAW POCKET</Text>
                <Image
                  source={{ uri: 'https://i.stack.imgur.com/YLy3V.png' }}
                  style={styles.imgQrCode}
                />
              </View>
              <CustomButton
                name="Share QR Code"
                borderBtn={true}
                icon={
                  <Entypo
                    name="share"
                    size={20}
                    color={theme.colors.iconColor}
                    style={styles.btnShare}
                  />
                }
                onPress={() => onShare('https://i.stack.imgur.com/YLy3V.png')}
              />
            </View>
          </>
        </Modalize>

        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          disableScrollIfPossible
          handleStyle={[
            styles.modalHandleStyle,
            { backgroundColor: theme.colors.transparent },
          ]}
          FooterComponent={() => <ModalFooter />}
          modalStyle={styles.modalStyle}
        >
          <>
            <View style={modalizeCont}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  openPickerCamera();
                  modalizeRef.current?.close();
                }}
                style={openPickerCont}
              >
                <Text style={txtModalText}>Camera</Text>
              </TouchableOpacity>
              <View style={modalDividerCont} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  openPickerPhotos();
                  modalizeRef.current?.close();
                }}
                style={openPickerCont}
              >
                <Text style={txtModalText}>Photos</Text>
              </TouchableOpacity>
              <View style={modalDividerCont} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  openPicker();
                  modalizeRef.current?.close();
                }}
                style={openPickerCont}
              >
                <Text style={txtModalText}>Files</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                modalizeRef.current?.close();
              }}
              style={modalizeCancelBtn}
            >
              <Text style={[txtModalText, fontBold]}>Cancel</Text>
            </TouchableOpacity>
          </>
        </Modalize>
      </Portal>
    </>
  );
};

export default MyProfile;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
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
    // height: 50,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: props.insets.top + theme.spacing.s,
    // paddingBottom: props.insets.bottom + theme.spacing.s,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m - 6,
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
    // backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.l,
  },
  txtTotalCase2: {
    fontSize: theme.fontSize.m + 5,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtTotalHour2: {
    fontSize: theme.fontSize.m + 5,
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
    marginTop: theme.spacing.s,
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
    marginHorizontal: theme.spacing.l - 4,
  },
  modalHandleStyle: { backgroundColor: theme.colors.modalHandleColor },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
    paddingBottom: props.insets.bottom,
  },
  qrModalCont: {
    backgroundColor: theme.colors.background,
    height: HEIGHT / 1.5,
    paddingHorizontal: theme.spacing.l - 4,
    paddingBottom: theme.spacing.l - 4,
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
    alignItems: 'center',
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
  backBtnCont: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
    // backgroundColor: 'red',
  },
  indicatorView: { position: 'absolute', alignSelf: 'center' },
  iconSetting: {
    // backgroundColor: 'red',
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  refreshControl: {
    backgroundColor: theme.colors.primary,
  },
}));
