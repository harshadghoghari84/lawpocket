import * as React from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import BottomSheetChooseImage, {
  ImageProps,
} from 'src/components/BottomSheetChooseImage';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import EditIcon from 'src/components/svg/EditIcon';
import { WIDTH } from 'src/constants';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { setSuccess } from 'src/redux/global/global.slice';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateUserProfilePhoto } from 'src/redux/setProfile/setProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';

const SetProfileLawDegree: React.FC<
  AuthNavigationProps<Route.navSetProfileLawDegree>
> = ({ navigation }) => {
  const loading = useSelector(selectSetProfileLoading);

  const styles = useStyles();
  const commonStyle = commonStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const modalizeRef = React.useRef<Modalize>(null);

  const [image, setImage] = React.useState<ImageProps[]>([]);

  const onPressNext = async () => {
    if (image.length > 0) {
      const result = await dispatch(
        updateUserProfilePhoto({
          steps: 3,
          profilePhot: image[0]?.img,
        }),
      );
      if (updateUserProfilePhoto.fulfilled.match(result)) {
        dispatch(setSuccess(result.payload));
        navigation.navigate(Route.navSetProfileAssociationNum);
      } else {
      }
    } else {
      Snackbar.show({
        text: 'please set the LawDegree',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        profileIcon={true}
        title={constants.setProfile}
        dummy={true}
      />
      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={60} totalCount={5} height={10} color={true} />
      </View>
      <Text style={commonStyle.txtTitle}>3. Law degree</Text>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => modalizeRef.current?.open()}
          style={styles.addPhotoCont}
        >
          {image.length > 0 ? (
            <Image source={{ uri: image[0]?.img }} style={styles.imageCont} />
          ) : (
            <View style={styles.addPhotoIconCont}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={40}
                color={theme.colors.primary}
              />
              <Text style={styles.txtAddPhoto}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        {image.length > 0 && (
          <View style={styles.editCont}>
            <EditIcon color={theme.colors.primary} style={styles.editIcon} />
            <Text style={styles.txtEdit}>Edit</Text>
          </View>
        )}
      </View>
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
        setImage={setImage}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
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
  txt: {
    color: theme.colors.grey3,
    marginLeft: theme.spacing.m - 6,
  },
  backCont: {
    height: 45,
    width: 45,
    borderRadius: theme.borderRadii.m,
    borderColor: theme.colors.grey,
    borderWidth: theme.borderRadii.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.l - 4,
    paddingBottom: theme.spacing.l - 4,
  },
  addPhotoCont: {
    height: 200,
    width: 200,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
    overflow: 'hidden',
  },
  addPhotoIconCont: { alignItems: 'center', justifyContent: 'center' },
  txtAddPhoto: {
    fontSize: theme.fontSize.m - 2,
    marginTop: theme.spacing.m - 8,
    color: theme.colors.textPrimary,
  },
  imageCont: {
    borderRadius: theme.borderRadii.m,
    height: 200,
    width: 200,
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
    paddingVertical: theme.spacing.m - 5,
    marginTop: theme.spacing.s,
  },
  editIcon: {
    marginLeft: theme.spacing.s,
  },
  txtEdit: {
    marginHorizontal: theme.spacing.s + 3,
    fontWeight: '500',
    color: theme.colors.black,
  },
}));

export default SetProfileLawDegree;
