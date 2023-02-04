import { useFormik } from 'formik';
import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// relative path
import { CheckBox, makeStyles, useTheme } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import AppleAuthButton from 'src/components/authentication/AppleAuthButton';
import FbAuthButton from 'src/components/authentication/FBAuthButton';
import LinkedInAuthButton from 'src/components/authentication/LinkedInAuthButton';
import CustomButton from 'src/components/CustomButton';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import BackIcon from 'src/components/svg/BackIcon';
import CheckIcon from 'src/components/svg/CheckIcon';
import LockIcon from 'src/components/svg/LockIcon';
import MailIcon from 'src/components/svg/MailIcon';
import UserIcon from 'src/components/svg/UserIcon';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectAuthenticationLoading } from 'src/redux/authentication/authentication.selectors';
import { userRegistration } from 'src/redux/authentication/authentication.thunks';
import { setSuccess } from 'src/redux/global/global.slice';
import { RegisterFormProps } from 'src/types/authentication.types';
import { LoadingState } from 'src/types/global.types';
import { AuthNavigationProps } from 'src/types/navigation.types';
import { formatErrors } from 'src/utils/formatErrors';
import * as Yup from 'yup';

export const RegisterScreenSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('password is required'),
  confirmPassword: Yup.string()
    .required('confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Register2: React.FC<AuthNavigationProps<Route.navRegister2>> = ({
  navigation,
}) => {
  const loading = useSelector(selectAuthenticationLoading);

  const styles = useStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [isSelected, setSelection] = React.useState<boolean>(false);

  const firstRef = React.useRef<TextInput>(null);
  const lastRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    handleSubmit,
    setErrors,
  } = useFormik<RegisterFormProps>({
    validationSchema: RegisterScreenSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ firstName, lastName, email, password }) => {
      if (isSelected) {
        const result = await dispatch(
          userRegistration({ firstName, lastName, email, password }),
        );

        if (userRegistration.fulfilled.match(result)) {
          dispatch(
            setSuccess(
              'Please check your email we just sent to your email account to verify your email',
            ),
          );
        } else {
          // dispatch(setOAuthLoading(null));
          setErrors(formatErrors(result.payload.errors));
        }
      } else {
        Snackbar.show({
          text: 'you must agree with Terms&Condition',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.white,
        });
      }
    },
  });

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
        <View style={styles.topCont}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.btnBack}
          >
            <BackIcon color={theme.colors.iconColor} />
          </TouchableOpacity>
          <Text style={styles.txtCompleteTypeSetup}>
            Complete your account set up
          </Text>
        </View>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          style={styles.scrollViewCont}
        >
          <View style={styles.textInCont}>
            <CustomTxtInput
              placeholder={'First Name'}
              icon={<UserIcon color={theme.colors.primary} />}
              ref={firstRef}
              returnKeyType="next"
              returnKeyLabel="next"
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              error={errors.firstName}
              touched={touched.firstName}
              onSubmitEditing={() => lastRef.current?.focus()}
            />
            <CustomTxtInput
              placeholder={'Last Name'}
              ref={lastRef}
              icon={<UserIcon color={theme.colors.primary} />}
              returnKeyType="next"
              returnKeyLabel="next"
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              error={errors.lastName}
              touched={touched.lastName}
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <CustomTxtInput
              ref={emailRef}
              icon={<MailIcon color={theme.colors.primary} />}
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
              returnKeyType="next"
              returnKeyLabel="next"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
              touched={touched.password}
            />
            <CustomTxtInput
              placeholder="Confirm Password"
              icon={<LockIcon color={theme.colors.primary} />}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              secureTextEntry
              returnKeyType="done"
              returnKeyLabel="done"
            />
          </View>
          <View style={styles.tcCont}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSelection(!isSelected)}
              style={styles.termsAndConditionCont}
            >
              <CheckBox
                checked={isSelected}
                containerStyle={styles.checkBoxCont}
                checkedIcon={<CheckIcon color={theme.colors.primary} />}
                uncheckedIcon={
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={20}
                    color={theme.colors.grey}
                  />
                }
                onPress={() => setSelection(!isSelected)}
              />

              <Text style={styles.agreeTxtTc}>I agree with</Text>
            </TouchableOpacity>
            <Text onPress={() => {}} style={styles.txtTc}>
              {' '}
              Terms & Conditions
            </Text>
          </View>

          <View style={styles.buttonCont}>
            <CustomButton
              onPress={() => handleSubmit()}
              name={'Sign up'}
              disabled={loading === LoadingState.CREATE}
              loading={loading === LoadingState.CREATE}
            />
          </View>
          <View style={styles.DividerCont}>
            <View style={styles.vDividerLine} />
            <Text style={styles.txtOrLoginWith}>OR SIGN UP WITH</Text>
            <View style={styles.vDividerLine} />
          </View>
          <View style={styles.socialLoginCont}>
            <FbAuthButton />
            <LinkedInAuthButton />
            {Platform.OS === 'ios' ? <AppleAuthButton /> : null}
          </View>
        </ScrollView>
      </LinearGradient>
      <SafeAreaView style={styles.bottomSafeAreaView} />
    </>
  );
};

export default Register2;

export const useStyles = makeStyles(theme => ({
  bottomSafeAreaView: {
    flex: 0,
    backgroundColor: theme.colors.bottomSafeAreaViewColor,
  },
  lgCont: { flex: 1 },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors.background,
  },
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  txtTc: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  agreeTxtTc: {
    color: theme.colors.textPrimary,
  },
  scrollViewCont: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  topCont: {
    marginHorizontal: theme.spacing.xl,
  },
  txtCompleteTypeSetup: {
    fontSize: theme.fontSize.l - 4,
    marginTop: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  textInCont: {
    marginTop: theme.spacing.m - 6,
  },
  txtInCont: {
    marginVertical: theme.spacing.l,
    height: 50,
    width: WIDTH - 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.grey5,
    borderRadius: theme.borderRadii.m,
  },
  vTxtInCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tcCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  termsAndConditionCont: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    height: 50,
    // flex: 1,
  },

  buttonCont: {
    marginVertical: theme.spacing.m - 6,
  },
  DividerCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: theme.spacing.l - 4,
  },
  vDividerLine: {
    height: Platform.OS === 'android' ? 1 : 0.5,
    width: 90,
    backgroundColor: theme.colors.grey3,
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
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  socialCont: { height: '50%', width: '50%', resizeMode: 'contain' },
  btnBack: {
    height: 40,
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  checkBoxCont: { width: 40 },
}));
