import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as React from 'react';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import AppleAuthButton from 'src/components/authentication/AppleAuthButton';
import FbAuthButton from 'src/components/authentication/FBAuthButton';
import LinkedInAuthButton from 'src/components/authentication/LinkedInAuthButton';
import ModalFooter from 'src/components/BottomSheetFooter';
// relative path
import CustomButton from 'src/components/CustomButton';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import LockIcon from 'src/components/svg/LockIcon';
import UserIcon from 'src/components/svg/UserIcon';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectAuthenticationLoading } from 'src/redux/authentication/authentication.selectors';
import {
  userForgotPassword,
  userLogin,
} from 'src/redux/authentication/authentication.thunks';
import { setSuccess } from 'src/redux/global/global.slice';
import { resendVerifyEmail } from 'src/redux/updateProfile/updateProfile.thunk';
import {
  ForgotPasswordProps,
  LoginFormProps,
} from 'src/types/authentication.types';
import { LoadingState } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';
import { formatErrors } from 'src/utils/formatErrors';
import { init } from 'src/utils/setNavigation';
import * as Yup from 'yup';
import { useGetFcmToken } from 'src/hooks/useGetFcmToken';

export const LoginScreenSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});
export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const Login: React.FC<AuthNavigationProps<Route.navLogin>> = ({
  navigation,
}) => {
  const styles = useStyles();
  const modalizeRef = React.useRef<Modalize>(null);
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const route = useNavigation();
  const { refetch } = useMeQuery({ enabled: false });

  const [activeResendEmail, setActiveResendEmail] = React.useState(false);
  const [fcmToken, setFcmToken] = React.useState('');
  const [loader, setLoader] = React.useState(false);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onSignUp = () => {
    navigation.navigate(Route.navRegister2);
  };

  const emaiRef = React.useRef<TextInput>(null);
  const forgotPassEmailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const loading = useSelector(selectAuthenticationLoading);

  useEffect(() => {
    const Init = async () => {
      useGetFcmToken().then(token => {
        setFcmToken(token);
      });
    };
    Init();
  }, []);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setErrors,
  } = useFormik<LoginFormProps>({
    validationSchema: LoginScreenSchema,
    initialValues: { email: '', password: '' },
    onSubmit: async ({ email, password }) => {
      const result = await dispatch(userLogin({ email, password, fcmToken }));
      if (userLogin.fulfilled.match(result)) {
        refetch().then(userData => {
          userData?.data && init(userData.data, route);
          // if (
          //   userData.data.userType === UserType.ATTORNEY ||
          //   userData.data.userType === UserType.LAW_FIRM ||
          //   userData.data.userType === UserType.LEGAL_SERVICE_PROVIDER
          // ) {
          //   if (userData.data.isVerify === SetupProfileStatus.VERIFY) {
          //     navigation.dispatch(
          //       CommonActions.reset({
          //         index: 0,
          //         routes: [
          //           {
          //             name: Route.navDashboard,
          //             params: {},
          //           },
          //         ],
          //       }),
          //     );
          //   } else {
          //     navigation.dispatch(
          //       CommonActions.reset({
          //         index: 0,
          //         routes: [
          //           {
          //             name: Route.navSetProfileCheckData,
          //             params: {},
          //           },
          //         ],
          //       }),
          //     );
          //   }
          // } else {
          //   navigation.dispatch(
          //     CommonActions.reset({
          //       index: 0,
          //       routes: [
          //         {
          //           name: Route.navDashboard,
          //           params: {},
          //         },
          //       ],
          //     }),
          //   );
          // }
        });
      } else {
        setErrors(formatErrors(result.payload.errors));
        setActiveResendEmail(true);
      }
    },
  });
  const forgotFormik = useFormik<ForgotPasswordProps>({
    validationSchema: ForgotPasswordSchema,
    initialValues: { email: '' },
    onSubmit: async ({ email }) => {
      const result = await dispatch(userForgotPassword({ email }));

      if (userForgotPassword.fulfilled.match(result)) {
        dispatch(setSuccess('Reset password link sent to your email'));
        forgotFormik.setFieldValue('email', '');
        modalizeRef.current?.close();
      } else {
        forgotFormik.setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  const onPressResendEmail = async () => {
    setLoader(true);
    const result = await dispatch(resendVerifyEmail({ email: values.email }));

    // console.log('result', result);
    if (resendVerifyEmail.fulfilled.match(result)) {
      setLoader(false);
      dispatch(
        setSuccess(
          'Please check your email we just sent to your email account to verify your email',
        ),
      );
    } else {
      setLoader(false);
    }
  };
  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      <LinearGradient
        style={styles.lgCont}
        // colors={[theme.colors.white, theme.colors.tabBgColor]}
        colors={[
          theme.colors.bgcFirstGradientColor,
          theme.colors.bgcSecondGradientColor,
        ]}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.scrollViewCont}
        >
          <View style={styles.mainCont}>
            <View style={styles.logoCont}>
              <Image
                source={require('src/helper/image/lp.png')}
                style={styles.vLogo}
              />
              <View style={styles.vTxt}>
                <Text style={styles.txtWelcome}>Welcome!</Text>
                <Text style={styles.txtLoginToYourAcc}>
                  Login to your account
                </Text>
              </View>
            </View>
            <KeyboardAvoidingView style={styles.textInCont}>
              <CustomTxtInput
                ref={emaiRef}
                icon={<UserIcon color={theme.colors.primary} />}
                placeholder="Email"
                returnKeyType="next"
                returnKeyLabel="next"
                keyboardType={'email-address'}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={errors.email}
                touched={touched.email}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <CustomTxtInput
                icon={<LockIcon color={theme.colors.primary} />}
                placeholder="Password"
                secureTextEntry={true}
                ref={passwordRef}
                returnKeyType="done"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={errors.password}
                touched={touched.password}
                returnKeyLabel="done"
                forgotPassword={true}
                onPress={() => onOpen()}
              />
            </KeyboardAvoidingView>
            {activeResendEmail && (
              <TouchableOpacity
                onPress={() => onPressResendEmail()}
                style={styles.resendEmailCont}
              >
                {loader ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.txtResendEmail}>resend Email</Text>
                )}
              </TouchableOpacity>
            )}
            <CustomButton
              name={'Login'}
              disabled={!isValid || loading === LoadingState.CREATE}
              loading={loading === LoadingState.CREATE}
              onPress={() => handleSubmit()}
            />
            <View style={styles.DividerCont}>
              <View style={styles.vDividerLine} />
              <Text style={styles.txtOrLoginWith}>OR LOGIN WITH</Text>
              <View style={styles.vDividerLine} />
            </View>
            <View style={styles.socialLoginCont}>
              <FbAuthButton />
              <LinkedInAuthButton />
              {Platform.OS === 'ios' ? <AppleAuthButton /> : null}
            </View>
          </View>
          <View style={styles.bottomCont}>
            <Text style={styles.txtDontHaveAcc}>Don't have an account?</Text>
            <CustomButton
              onPress={() => onSignUp()}
              borderBtn={true}
              name={'Sign up'}
            />
          </View>
        </ScrollView>
        <Portal>
          <Modalize
            handleStyle={styles.modalHandle}
            handlePosition="inside"
            adjustToContentHeight
            closeOnOverlayTap
            FooterComponent={() => <ModalFooter />}
            ref={modalizeRef}
          >
            <>
              <View style={styles.modalItmCont}>
                <View style={styles.modalCont}>
                  <View style={styles.vLockResetPass}>
                    <Icon
                      name="lock-closed"
                      size={50}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.txtResetPass}>Reset password?</Text>
                  <Text style={styles.txtResetPass2}>
                    Please enter your email and we will send password reset
                    instructions.
                  </Text>
                </View>
                <View style={styles.modalTextInCont}>
                  <CustomTxtInput
                    ref={forgotPassEmailRef}
                    icon={<UserIcon color={theme.colors.primary} />}
                    placeholder="Email"
                    keyboardType={'email-address'}
                    // returnKeyType="done"
                    // returnKeyLabel="done"
                    onChangeText={forgotFormik.handleChange('email')}
                    onBlur={forgotFormik.handleBlur('email')}
                    value={forgotFormik.values.email}
                    error={forgotFormik.errors.email}
                    touched={forgotFormik.touched.email}
                  />
                  <View style={styles.modalButtons}>
                    <CustomButton
                      height={40}
                      smallBtn={WIDTH / 2 - 50}
                      borderBtn={true}
                      name={'Cancel'}
                      onPress={() => {
                        forgotFormik.setFieldValue('email', '');
                        modalizeRef.current?.close();
                      }}
                    />
                    <CustomButton
                      height={40}
                      smallBtn={WIDTH / 2 - 50}
                      borderBtn={false}
                      name={'submit'}
                      disabled={
                        !forgotFormik.isValid || loading === LoadingState.CREATE
                      }
                      loading={loading === LoadingState.CREATE}
                      onPress={() => forgotFormik.handleSubmit()}
                    />
                  </View>
                </View>
              </View>
            </>
          </Modalize>
        </Portal>
      </LinearGradient>
      <SafeAreaView style={styles.bottomSafeAreaView} />
    </>
  );
};

export default Login;

export const useStyles = makeStyles(theme => ({
  bottomSafeAreaView: {
    flex: 0,
    backgroundColor: theme.colors.bottomSafeAreaViewColor,
  },
  lgCont: { flex: 1 },
  mainCont: { flex: 1 },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors.background,
  },
  container: {
    backgroundColor: theme.colors?.tabBgColor,
    flex: 1,
    alignItems: 'center',
  },
  scrollViewCont: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  logoCont: {
    alignItems: 'center',
  },
  vLogo: {
    height: 130,
    width: 130,
    backgroundColor: theme.colors.primary,
    marginVertical: theme.spacing.l - 4,
    borderRadius: theme.borderRadii.s,
  },
  vTxt: {
    marginTop: theme.spacing.l,
    alignItems: 'center',
  },
  txtWelcome: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
  },
  txtLoginToYourAcc: {
    fontSize: theme.fontSize.m - 2,
    color: theme.colors.textSecondary,
  },

  DividerCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: theme.spacing.l,
  },
  vDividerLine: {
    height: Platform.OS === 'android' ? 1 : 0.5,
    width: 80,
    backgroundColor: theme.colors.grey,
  },
  txtOrLoginWith: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.m - 4,
  },
  socialLoginCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.m - 6,
    paddingBottom: theme.spacing.m - 6,
  },
  vSocial: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.l - 4,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.tabBgColor,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  bottomCont: {
    paddingBottom: theme.spacing.m - 6,
  },
  txtDontHaveAcc: {
    marginVertical: theme.spacing.m - 6,
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  modalCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtResetPass: {
    fontSize: theme.fontSize.l,
    marginVertical: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtResetPass2: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: theme.spacing.l - 4,
    lineHeight: theme.spacing.l,
  },
  vLockResetPass: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.xxl,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l - 4,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
  },
  textInCont: { marginVertical: theme.spacing.m - 6 },
  modalHandle: { backgroundColor: theme.colors.modalHandleColor },
  modalItmCont: {
    justifyContent: 'center',
    paddingBottom: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  modalTextInCont: { marginTop: theme.spacing.m - 6 },
  socialImg: { height: '50%', width: '50%', resizeMode: 'contain' },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
  resendEmailCont: {
    alignSelf: 'flex-end',
    padding: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  txtResendEmail: {
    color: theme.colors.textPrimary,
  },
}));
