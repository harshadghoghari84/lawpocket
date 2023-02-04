import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { TextInput, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSelector } from 'react-redux';
import OAuthButton from 'src/components/authentication/OAuthButton';
import BottomSheetUpdateEmail from 'src/components/BottomSheetUpdateEmail';
import CustomButton from 'src/components/CustomButton';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import AppleIcon from 'src/components/svg/AppleIcon';
import UserIcon from 'src/components/svg/UserIcon';
import { API } from 'src/constants/apiEndpoints';
import { WIDTH } from 'src/constants/index';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectOAuthLoading } from 'src/redux/authentication/authentication.selectors';
import { setOAuthLoading } from 'src/redux/authentication/authentication.slice';
import { oAuth } from 'src/redux/authentication/authentication.thunks';
import { fetch } from 'src/redux/fetch';
import { setErrors, setSuccess } from 'src/redux/global/global.slice';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateMissingEmail } from 'src/redux/setProfile/setProfile.thunk';
import { resendVerifyEmail } from 'src/redux/updateProfile/updateProfile.thunk';
import { LoadingState } from 'src/types/global.types';
import { emailUpdateProps } from 'src/types/setProfile.types';
import { CurrentUser } from 'src/types/user.types';
import { formatErrors } from 'src/utils/formatErrors';
import { init } from 'src/utils/setNavigation';
import * as Yup from 'yup';
import { useGetFcmToken } from 'src/hooks/useGetFcmToken';

interface AppleAuthButtonProps {}

export const emailUpdateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});
const AppleAuthButton: React.FC<AppleAuthButtonProps> = () => {
  const loading = useSelector(selectOAuthLoading);
  const setProfileLoading = useSelector(selectSetProfileLoading);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const modalizeRef = React.useRef<Modalize>(null);
  const emaiRef = React.useRef<TextInput>(null);
  const { theme } = useTheme();
  const styles = useStyles();
  const [loader, setLoader] = React.useState(false);
  const [fcmToken, setFcmToken] = React.useState('');

  useEffect(() => {
    const Init = async () => {
      useGetFcmToken().then(token => {
        setFcmToken(token);
      });
    };
    Init();
  }, []);
  const updateEmailFormik = useFormik<emailUpdateProps>({
    validationSchema: emailUpdateSchema,
    initialValues: { email: '' },
    onSubmit: async ({ email }) => {
      const result = await dispatch(updateMissingEmail({ email, fcmToken }));
      if (updateMissingEmail.fulfilled.match(result)) {
        setLoader(true);
        const resultEmailVerify = await dispatch(
          resendVerifyEmail({ email: email }),
        );

        if (resendVerifyEmail.fulfilled.match(resultEmailVerify)) {
          modalizeRef.current?.close();

          setLoader(false);
          dispatch(
            setSuccess(
              'Please check your email we just sent to your email account to verify your email',
            ),
          );
        } else {
          setLoader(false);
        }
      } else {
        updateEmailFormik.setErrors(formatErrors(result.payload.errors));
      }
    },
  });

  const handleAppleSignIn = useCallback(async () => {
    try {
      dispatch(setOAuthLoading('apple'));
      // Attempt login with permissions
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      const result = await dispatch(
        oAuth({
          credential: appleCredential,
        }),
      );

      if (oAuth.fulfilled.match(result)) {
        dispatch(setOAuthLoading(null));
        if (result.payload.missingEmail) {
          modalizeRef.current?.open();
        } else {
          const { data: curUser } = await fetch<CurrentUser>({
            url: API.ME,
            method: 'GET',
          });

          curUser && init(curUser, navigation);
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{ name: Route.navSetProfileIntro }],
          //   }),
          // );
        }
      } else {
        dispatch(setOAuthLoading(null));
      }
    } catch (error) {
      dispatch(setOAuthLoading(null));

      dispatch(
        setErrors({
          code: 400,
          message: error?.message || 'Something went wrong',
          errors: [
            {
              domain: 'global',
              message: error?.message || 'Something went wrong',
            },
          ],
        }),
      );
    }
  }, [dispatch, navigation]);

  return (
    <>
      <OAuthButton
        onPress={handleAppleSignIn}
        loading={loading === 'apple'}
        disabled={loading !== null}
      >
        <AppleIcon color={theme.colors.iconColor} />
      </OAuthButton>
      <BottomSheetUpdateEmail
        modalizeRef={modalizeRef}
        children={
          <>
            <CustomTxtInput
              ref={emaiRef}
              icon={<UserIcon color={theme.colors.primary} />}
              placeholder="Email"
              keyboardType={'email-address'}
              onChangeText={updateEmailFormik.handleChange('email')}
              onBlur={updateEmailFormik.handleBlur('email')}
              value={updateEmailFormik.values.email}
              error={updateEmailFormik.errors.email}
              touched={updateEmailFormik.touched.email}
            />
            <View style={styles.modalButtons}>
              <CustomButton
                height={40}
                smallBtn={WIDTH / 2 - 50}
                borderBtn={false}
                name={'submit'}
                disabled={
                  !updateEmailFormik.isValid ||
                  setProfileLoading === LoadingState.CREATE ||
                  loader
                }
                loading={setProfileLoading === LoadingState.CREATE || loader}
                onPress={() => updateEmailFormik.handleSubmit()}
              />
              <CustomButton
                height={40}
                smallBtn={WIDTH / 2 - 50}
                borderBtn={true}
                name={'Cancel'}
                onPress={() => modalizeRef.current?.close()}
              />
            </View>
          </>
        }
      />
    </>
  );
};

export default AppleAuthButton;

export const useStyles = makeStyles(theme => ({
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
  },
}));
