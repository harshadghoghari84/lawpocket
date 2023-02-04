import { useFormik } from 'formik';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import OtpField from 'src/components/ui/OTPField';
import { WIDTH } from 'src/constants';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { setErrors } from 'src/redux/global/global.slice';
import {
  studentSendEmailVerification,
  studentVerifyOTPForEmail,
  updateStudentEmail,
} from 'src/redux/setProfile/setProfile.thunk';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { ThemeProps } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';
import { emailUpdateProps } from 'src/types/setProfile.types';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';

export const emailUpdateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});
export const OTPSchema = Yup.object().shape({
  otp: Yup.string().required('OTP is required').length(6, ''),
});
export interface OTPForm {
  otp: string;
}

const SetProfileStudentEmail: React.FC<
  AuthNavigationProps<Route.navSetProfileStudentEmail>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { data: currentUser } = useMeQuery();

  const [enableNextBtn, setEnableNextBtn] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [activeOtpView, setActiveOtpView] = React.useState<boolean>(false);
  const [editable, setEditable] = React.useState<boolean>(true);
  const [loaderUpdateEmail, setLoaderUpdateEmail] =
    React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (currentUser) {
      setFieldValue(
        'email',
        currentUser.studentEmail ? currentUser.studentEmail : '',
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigation]);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    handleSubmit,
    setFieldValue,
  } = useFormik<emailUpdateProps>({
    validationSchema: emailUpdateSchema,
    initialValues: { email: '' },
    onSubmit: async ({ email }) => {
      setLoader(true);
      const result = await dispatch(
        studentSendEmailVerification({
          studentEmail: email,
        }),
      );
      if (studentSendEmailVerification.fulfilled.match(result)) {
        setLoader(false);
        setActiveOtpView(true);
        setEnableNextBtn(true);
        setMessage("We've sent you six digit code. Please enter it below");
      } else {
        setLoader(false);
        console.log('in else');
        dispatch(setErrors(result.payload));
        Snackbar.show({
          text: result.payload.errors[0].message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.white,
        });
      }
    },
  });

  React.useEffect(() => {
    if (
      currentUser?.isEmailVerify &&
      currentUser?.studentEmail === values.email
    ) {
      setMessage('Email verified');
      setEditable(false);
    }
  }, [currentUser, values.email]);

  const OTP = useFormik<OTPForm>({
    validationSchema: OTPSchema,
    initialValues: { otp: '' },
    onSubmit: async ({ otp }) => {
      setLoaderUpdateEmail(true);
      const result = await dispatch(studentVerifyOTPForEmail({ otp: otp }));
      if (studentVerifyOTPForEmail.fulfilled.match(result)) {
        // setLoaderUpdateEmail(false);
        setMessage('Email verified');

        const resultStudentEmail = await dispatch(
          updateStudentEmail({ steps: 4, studentEmail: values.email }),
        );
        if (updateStudentEmail.fulfilled.match(resultStudentEmail)) {
          setLoaderUpdateEmail(false);
          setActiveOtpView(false);
          OTP.setFieldValue('otp', '');
          navigation.navigate(Route.navSetProfileProfilePhoto);
        } else {
          setLoaderUpdateEmail(false);
        }
      } else {
        setLoaderUpdateEmail(false);

        OTP.setErrors(formatErrors(result.payload.errors));
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
      <Text style={commonStyle.txtTitle}>4. Student Email</Text>
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        style={styles.outerCont}
      >
        <KeyboardAvoidingView style={styles.innerContainer}>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={theme.colors.textSecondary}
            returnKeyType="done"
            returnKeyLabel="done"
            editable={editable}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            style={styles.textIN}
          />
          <View style={styles.btnVerify}>
            <CustomButton
              smallBtn={80}
              name={
                currentUser?.isEmailVerify &&
                currentUser?.studentEmail === values.email
                  ? 'Update'
                  : 'Verify'
              }
              disabled={loader}
              loading={loader}
              onPress={() => {
                if (
                  currentUser?.isEmailVerify &&
                  currentUser?.studentEmail === values.email
                ) {
                  setEditable(true);
                  setFieldValue('email', '');
                  setMessage('');
                } else {
                  handleSubmit();
                }
              }}
            />
          </View>
        </KeyboardAvoidingView>
        {touched.email && errors.email && (
          <Text style={styles.error}>{errors.email}</Text>
        )}
        {message !== '' && <Text style={styles.txtMessage}>{message}</Text>}
        {activeOtpView && (
          <View style={styles.verifyCont}>
            <Text style={styles.txtEnterSixDigitCode}>
              Enter six digit code
            </Text>
            <View>
              <OtpField
                value={OTP.values.otp}
                touched={OTP.touched.otp}
                error={OTP.errors.otp}
                handleChange={code => OTP.setFieldValue('otp', code)}
              />
            </View>
          </View>
        )}
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
          disabled={
            loaderUpdateEmail
            // disableLoading ? false : loadingOtpVerify === LoadingState.CREATE
          }
          loading={
            loaderUpdateEmail
            // disableLoading ? false : loadingOtpVerify === LoadingState.CREATE
          }
          onPress={() => {
            if (enableNextBtn) {
              OTP.handleSubmit();
            } else {
              if (
                currentUser?.isEmailVerify &&
                currentUser?.studentEmail === values.email
              ) {
                navigation.navigate(Route.navSetProfileProfilePhoto);
              }
            }

            // if (values.email) {
            //   OTP.handleSubmit();
            // } else {
            //   handleSubmit();
            // }
          }}
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
  progressBarCont: {
    marginVertical: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.l - 4,
  },
  outerCont: {
    flex: 1,
  },
  txtTitle: {
    fontSize: theme.fontSize.l,
    marginHorizontal: theme.spacing.l - 4,
    fontWeight: '600',
  },
  textIN: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.textPrimary,
  },
  innerContainer: {
    // flex: 1,
    marginTop: theme.spacing.m - 6,
    marginHorizontal: theme.spacing.l - 4,
    alignItems: 'center',
    flexDirection: 'row',
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
  btnVerify: {
    marginLeft: theme.spacing.m - 6,
  },
  error: {
    marginLeft: theme.spacing.m + 4,
    marginTop: theme.spacing.s - 2,
    fontSize: theme.fontSize.m - 4,
    color: theme.colors.error,
  },
  verifyCont: {
    marginHorizontal: theme.spacing.m + 4,
    marginTop: theme.spacing.l,
  },
  txtEnterSixDigitCode: {
    fontSize: theme.fontSize.m - 3,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtMessage: {
    marginLeft: theme.spacing.m + 4,
    marginTop: theme.spacing.s - 2,
    fontSize: theme.fontSize.m - 4,
    color: theme.colors.greenLight,
  },
}));

export default SetProfileStudentEmail;
