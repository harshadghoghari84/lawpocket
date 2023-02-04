import * as React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import BottomSheetChooseImage from 'src/components/BottomSheetChooseImage';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import CameraIcon from 'src/components/svg/CameraIcon';
import UserOutlineIcon from 'src/components/svg/UserOutlineIcon';
import { WIDTH } from 'src/constants';
import constants, { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateUserProfilePhoto } from 'src/redux/setProfile/setProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';
import { getUrlExtension } from 'src/utils/common';

const SetProfileProfilePhoto: React.FC<
  AuthNavigationProps<Route.navSetProfileProfilePhoto>
> = ({ navigation }) => {
  const loading = useSelector(selectSetProfileLoading);
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const modalizeRef = React.useRef<Modalize>(null);
  const dispatch = useAppDispatch();
  const { data: currentUser } = useMeQuery();

  const { theme } = useTheme();

  const [image, setImage] = React.useState([]);

  const onPressNext = async () => {
    const formData = new FormData();
    Object.entries(image).forEach(([_key, val]) => {
      formData.append('profilePhoto', {
        name: val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
        type: val.type,
        uri: Platform.OS === 'ios' ? val.uri.replace('file://', '') : val.uri,
      });
    });
    formData.append('steps', 5);
    const result = await dispatch(updateUserProfilePhoto(formData));

    if (updateUserProfilePhoto.fulfilled.match(result)) {
      if (
        currentUser?.userType === UserType.CLIENT ||
        currentUser?.userType === UserType.LAW_STUDENT
      ) {
        navigation.navigate(Route.navSubscriptions);
      } else {
        navigation.navigate(Route.navSetProfileCheckData);
      }
    } else {
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        profileIcon={true}
        title={constants.setProfile}
        dummy={true}
      />
      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={100} totalCount={5} height={10} color={true} />
      </View>
      <Text style={commonStyle.txtTitle}>{`${
        currentUser?.userType === UserType.CLIENT ||
        currentUser?.userType === UserType.ATTORNEY
          ? '4'
          : '5'
      }. Profile Photo`}</Text>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => modalizeRef.current?.open()}
          style={styles.addPhotoCont}
        >
          {image.length > 0 ? (
            <Image source={{ uri: image[0]?.uri }} style={styles.imageCont} />
          ) : (
            <>
              <UserOutlineIcon
                color={theme.colors.grey}
                height={45}
                width={45}
              />
            </>
          )}
          <View style={styles.openCameraCont}>
            <CameraIcon color={theme.colors.white} height={12} width={12} />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => onPressNext()}
        style={styles.skipStepCont}
      >
        <Text style={styles.txtSkipStep}>Skip this step</Text>
      </TouchableOpacity>
      <View style={commonStyle.bottomCont}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={commonStyle.backCont}
        >
          <Icon name="arrow-back" size={25} color={theme.colors.grey} />
        </TouchableOpacity>
        <CustomButton
          smallBtn={WIDTH - 110}
          name={'Next'}
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          onPress={() => onPressNext()}
        />
      </View>
      <BottomSheetChooseImage
        modalizeRef={modalizeRef}
        image={image}
        multiple={false}
        onlyPickImage={true}
        setImage={setImage}
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
  progressBarCont: {
    marginVertical: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.l - 4,
  },
  txtTitle: {
    fontSize: theme.fontSize.l,
    marginHorizontal: theme.spacing.l - 4,
    fontWeight: '600',
  },
  innerContainer: {
    flex: 1,
    marginTop: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.l - 4,
    alignItems: 'center',
  },
  vState: {
    backgroundColor: theme.colors.lightestGrey,
    height: 40,
    borderRadius: theme.borderRadii.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.l - 4,
    marginBottom: theme.spacing.l - 4,
  },
  iconAndTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: theme.colors.grey3,
    marginLeft: theme.spacing.m - 6,
  },

  modalHeaderCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6 + 5,
  },
  txtStateCity: {
    fontSize: theme.fontSize.l,
    fontWeight: '700',
  },
  modalCloseCont: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dummyView: {
    width: 50,
  },
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
  vStateCity: {
    width: '85%',
    marginTop: theme.spacing.m - 6,
  },
  saveItemCont: {
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.l,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m - 6 - 7,
    paddingVertical: theme.spacing.m - 6 - 7,
    width: 120,
    margin: theme.spacing.m,
  },
  addPhotoCont: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.xxl,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  txtAddPhoto: {
    fontSize: theme.fontSize.m,
    marginTop: theme.spacing.m,
  },
  imageCont: {
    borderRadius: theme.borderRadii.xxl,
    height: 100,
    width: 100,
    resizeMode: 'cover',
  },
  editCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m - 6,
    paddingVertical: theme.spacing.m - 6 - 2,
    marginTop: theme.spacing.m - 6,
  },
  txtEdit: {
    marginHorizontal: theme.spacing.m,
  },
  openCameraCont: {
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: theme.spacing.s - 3,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadii.l,
    position: 'absolute',
    bottom: 10,
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
  skipStepCont: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.l - 4 + 10,
    alignSelf: 'center',
  },
  txtSkipStep: {
    color: theme.colors.primary,
    fontWeight: '500',
    paddingHorizontal: theme.spacing.m - 6,
    paddingVertical: theme.spacing.m - 6,
  },
}));

export default SetProfileProfilePhoto;
