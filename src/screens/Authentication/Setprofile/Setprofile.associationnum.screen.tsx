import { useFormik } from 'formik';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import { ProgressBar } from 'src/components/ProgressBar';
import LawFirmIcon from 'src/components/svg/LawFirmIcon';
import { WIDTH } from 'src/constants';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateUserAssociationNumber } from 'src/redux/setProfile/setProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { AssociationNumProps } from 'src/types/authentication.types';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';

export const AssociationNumberScreenSchema = Yup.object().shape({
  associationNumber: Yup.string().required('associationNumber is required'),
});

const SetProfileAssociationNum: React.FC<
  AuthNavigationProps<Route.navSetProfileAssociationNum>
> = ({ navigation }) => {
  const loading = useSelector(selectSetProfileLoading);
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { data: currentUser } = useMeQuery();

  React.useEffect(() => {
    if (currentUser) {
      setFieldValue(
        'associationNumber',
        currentUser?.associationNumber ? currentUser?.associationNumber : '',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    handleSubmit,
    setErrors,
    setFieldValue,
  } = useFormik<AssociationNumProps>({
    validationSchema: AssociationNumberScreenSchema,
    initialValues: {
      associationNumber: '',
    },
    onSubmit: async ({ associationNumber }) => {
      const result = await dispatch(
        updateUserAssociationNumber({
          steps: 4,
          associationNumber: associationNumber,
        }),
      );
      if (updateUserAssociationNumber.fulfilled.match(result)) {
        navigation.navigate(Route.navSetProfileProfilePhoto);
      } else {
        setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  return (
    <View style={styles.container}>
      <CustomHeader
        profileIcon={true}
        title={constants.setProfile}
        dummy={true}
      />
      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={80} totalCount={100} height={10} color={true} />
      </View>
      <Text style={commonStyle.txtTitle}>4. Bar association number</Text>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.scrollCont}
      >
        <KeyboardAvoidingView style={styles.innerContainer}>
          <CustomTxtInput
            icon={
              <LawFirmIcon
                color={theme.colors.primary}
                height={16}
                width={16}
              />
            }
            placeholder="Enter Number"
            forgotPassword={false}
            returnKeyType="done"
            returnKeyLabel="done"
            onChangeText={handleChange('associationNumber')}
            onBlur={handleBlur('associationNumber')}
            value={values.associationNumber}
            error={errors.associationNumber}
            touched={touched.associationNumber}
          />
        </KeyboardAvoidingView>
      </ScrollView>
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
          onPress={() => handleSubmit()}
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  scrollCont: { flexGrow: 1 },
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
    marginTop: theme.spacing.m - 6,
    marginHorizontal: theme.spacing.l - 4,
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
    margin: theme.spacing.m - 6 - 5,
  },
  addPhotoCont: {
    height: 200,
    width: 200,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.lightestGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
    overflow: 'hidden',
  },
  txtAddPhoto: {
    fontSize: theme.fontSize.m,
    marginTop: theme.spacing.m - 6 - 5,
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
    paddingVertical: theme.spacing.m - 6 - 2,
    marginTop: theme.spacing.m - 6,
  },
  txtEdit: {
    marginHorizontal: theme.spacing.m - 6 - 5,
  },
}));

export default SetProfileAssociationNum;
