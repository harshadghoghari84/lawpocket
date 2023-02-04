import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import ModalFooter from 'src/components/BottomSheetFooter';
import ModalHeader from 'src/components/BottomSheetHeader';
import CustomButton from 'src/components/CustomButton';
import { Divider } from 'src/components/Divider';
import { NameFirstChar } from 'src/components/NameFirstChar';
import StarIcon from 'src/components/svg/StarIcon';
import StarOutlineIcon from 'src/components/svg/StarOutlineIcon';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { rateReview } from 'src/redux/lawyer/lawyer.thunk';

export interface BottomSheetRatingProps {
  modalizeRef?: React.MutableRefObject<IHandles>;
  profile?: string;
  name?: string;
  uid?: number;
  setActiveRatingSheet?: (value: boolean) => void;
  userType: number;
  navigationDisable?: boolean;
  // defaultRating?: number;
  // maxRating?: number[];
  // setDefaultRating?: (val: number) => void;
}

const BottomSheetRating: React.FC<BottomSheetRatingProps> = ({
  modalizeRef,
  profile,
  name,
  uid,
  setActiveRatingSheet,
  userType,
  navigationDisable,
  // defaultRating,
  // maxRating,
  // setDefaultRating,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const [defaultRating, setDefaultRating] = React.useState<number>(4);
  const [maxRating] = React.useState<number[]>([1, 2, 3, 4, 5]);

  const [value, setValue] = React.useState<string>('');
  const [loader, setLoader] = React.useState<boolean>(false);

  const onPressSubmit = async () => {
    setLoader(true);
    const result = await dispatch(
      rateReview({
        rate: defaultRating,
        review: value ? value : '',
        forUser: uid,
      }),
    );

    console.log('result', result);
    if (rateReview.fulfilled.match(result)) {
      setLoader(false);
      if (!navigationDisable) {
        navigation.navigate({
          name: Route.navChat as never,
          params: {} as never,
        });
      } else {
        setLoader(false);
        modalizeRef.current.close();
      }
    } else {
      setLoader(false);
    }
  };

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        disableScrollIfPossible={false}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        handlePosition="inside"
        onClosed={() => {
          setActiveRatingSheet && setActiveRatingSheet(false);
        }}
        handleStyle={styles.modalHandleStyle}
        FooterComponent={() => <ModalFooter />}
        HeaderComponent={() => (
          <ModalHeader
            title={`Rate ${
              userType === UserType.ATTORNEY
                ? 'Attorney'
                : userType === UserType.LAW_FIRM
                ? 'LawFirm'
                : userType === UserType.LEGAL_SERVICE_PROVIDER
                ? 'Legal Service Provider'
                : userType === UserType.CLIENT
                ? 'Client'
                : userType === UserType.LAW_STUDENT
                ? 'Law Student'
                : ''
            }`}
          />
        )}
      >
        <>
          <SafeAreaView style={styles.modalContRating}>
            <View style={styles.nameProfileRateCont}>
              <View style={styles.addPhotoContInner}>
                <>
                  {profile ? (
                    <Image source={{ uri: profile }} style={styles.imageCont} />
                  ) : (
                    <NameFirstChar
                      name={name}
                      size={100}
                      fontSize={theme.fontSize.l}
                    />
                  )}
                </>
              </View>

              <Text style={styles.txtNameAttorney}>{name}</Text>
              <View style={styles.modalRattingCont}>
                {maxRating?.map((item: number) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={item}
                      onPress={() => setDefaultRating(item)}
                    >
                      {item <= defaultRating ? (
                        <StarIcon
                          height={30}
                          width={30}
                          color={theme.colors.primary}
                        />
                      ) : (
                        <StarOutlineIcon
                          height={30}
                          width={30}
                          color={theme.colors.grey}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <Divider />
            <View style={styles.secondRateCont}>
              <View style={styles.txtAndTextInCont}>
                <Text style={styles.txtWriteReview}>Write Review</Text>
                <TextInput
                  placeholder="Please enter your review here"
                  placeholderTextColor={theme.colors.grey}
                  value={value}
                  onChangeText={(val: string) => setValue(val)}
                  multiline
                  style={styles.textInCont}
                />
              </View>
              <View style={styles.bottomBtnCont}>
                <CustomButton
                  loading={loader}
                  disabled={loader}
                  name="Submit"
                  onPress={() => onPressSubmit()}
                />
              </View>
            </View>
          </SafeAreaView>
        </>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles(theme => ({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  modalCont: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHandleStyle: { backgroundColor: theme.colors.modalHandleColor },
  //   modalHeaderCont: {
  //     width: '100%',
  //     paddingHorizontal: theme.spacing.m - 6 + 5,
  //     paddingVertical: theme.spacing.m - 6,
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     justifyContent: 'space-between',
  //   },
  modalContRating: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.m : null,
    backgroundColor: theme.colors.background,
  },
  secondRateCont: { flex: 1, marginHorizontal: theme.spacing.l - 4 },

  modalHeaderCont: {
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6,
  },
  modalCloseCont: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  nameProfileRateCont: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: theme.spacing.m - 4,
  },
  txtWriteReview: {
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    marginVertical: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  textInCont: {
    height: 150,
    borderRadius: theme.borderRadii.m,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    padding: theme.spacing.m,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    color: theme.colors.textPrimary,
  },
  bottomBtnCont: { marginVertical: theme.spacing.s },
  txtAndTextInCont: { flex: 1 },
  addPhotoCont: {
    height: 160,
    width: 160,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.black1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  imageCont: {
    borderRadius: theme.borderRadii.xxl + 50,
    height: 140,
    width: 140,
    resizeMode: 'cover',
  },
  addPhotoContInner: {
    height: 110,
    width: 110,
    borderRadius: theme.borderRadii.xxl + 50,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.m - 6,
  },
  txtNameAttorney: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    marginTop: theme.spacing.m,
    color: theme.colors.textPrimary,
  },
  safeAreaView: { paddingBottom: theme.spacing.m - 6 },
  actionCont: {
    height: Platform.OS === 'ios' ? 40 : 50,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.m - 6,
  },
  composerCont: { height: 45, flex: 1 },
  modalRattingCont: {
    flexDirection: 'row',
    width: '60%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.l,
  },
}));

export default BottomSheetRating;
