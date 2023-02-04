import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { TextInput, View } from 'react-native';
import Config from 'react-native-config';
import { makeStyles, useTheme } from 'react-native-elements';
import LinkedInModal, { LinkedInToken } from 'react-native-linkedin';
import { Modalize } from 'react-native-modalize';
import { useSelector } from 'react-redux';
import OAuthButton from 'src/components/authentication/OAuthButton';
import BottomSheetUpdateEmail from 'src/components/BottomSheetUpdateEmail';
import CustomButton from 'src/components/CustomButton';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import LinkedIcon from 'src/components/svg/LinkedIcon';
import UserIcon from 'src/components/svg/UserIcon';
import { WIDTH } from 'src/constants';
import { API } from 'src/constants/apiEndpoints';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectOAuthLoading } from 'src/redux/authentication/authentication.selectors';
import { setOAuthLoading } from 'src/redux/authentication/authentication.slice';
import { linkedinAuth } from 'src/redux/authentication/authentication.thunks';
import { fetch as apiFetch } from 'src/redux/fetch';
import { setErrors, setSuccess } from 'src/redux/global/global.slice';
import { selectSetProfileLoading } from 'src/redux/setProfile/setProfile.selectors';
import { updateMissingEmail } from 'src/redux/setProfile/setProfile.thunk';
import { resendVerifyEmail } from 'src/redux/updateProfile/updateProfile.thunk';
import { LoadingState } from 'src/types/global.types';
import { emailUpdateProps } from 'src/types/setProfile.types';
import { CurrentUser } from 'src/types/user.types';
import { getProvider } from 'src/utils/common';
import { formatErrors } from 'src/utils/formatErrors';
import { init } from 'src/utils/setNavigation';
import * as Yup from 'yup';
import { useGetFcmToken } from 'src/hooks/useGetFcmToken';

interface LinkedInAuthButtonProps {}

export const emailUpdateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const LinkedInAuthButton: React.FC<LinkedInAuthButtonProps> = () => {
  const loading = useSelector(selectOAuthLoading);
  const setProfileLoading = useSelector(selectSetProfileLoading);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const linkedInRef = React.useRef<LinkedInModal>(null);
  const modalizeRef = React.useRef<Modalize>(null);
  const emaiRef = React.useRef<TextInput>(null);
  const [fcmToken, setFcmToken] = React.useState('');
  const { theme } = useTheme();
  const styles = useStyles();

  const [loader, setLoader] = React.useState(false);

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
  const handleLinkedinSignIn = useCallback(
    async (access_token, email, name) => {
      try {
        const result = await dispatch(
          linkedinAuth({
            idToken: access_token,
            name: name ? name : '',
            email: email ? email : null,
            uid: '',
            provider: getProvider('linkedin'),
          }),
        );

        if (linkedinAuth.fulfilled.match(result)) {
          dispatch(setOAuthLoading(null));
          if (result.payload.missingEmail) {
            modalizeRef.current?.open();
          } else {
            const { data: curUser } = await apiFetch<CurrentUser>({
              url: API.ME,
              method: 'GET',
            });
            curUser && init(curUser, navigation);
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
    },
    [dispatch, navigation],
  );

  const getUserNameAndEmail = async (access_token: string) => {
    const responseName = await fetch('https://api.linkedin.com/v2/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });
    const name = await responseName.json();

    const response = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + access_token,
        },
      },
    );
    const emailpayload = await response.json();
    handleLinkedinSignIn(
      access_token,
      emailpayload.elements[0]['handle~'].emailAddress,
      `${name.localizedFirstName} ${name.localizedLastName}`,
    );
  };

  const getUser = async ({ authentication_code }: LinkedInToken) => {
    try {
      const response = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/x-www-form-urlencoded',
          },
          body: `grant_type=authorization_code&code=
          ${authentication_code}&client_secret=${Config.LinkedClientSecret}&redirect_uri=${Config.LinkedRedirectUrl}&client_id=${Config.LinkedClientId}`,
        },
      );
      const apipayload = await response.json();

      getUserNameAndEmail(apipayload.access_token);
    } catch (error) {}
  };
  return (
    <>
      <OAuthButton
        onPress={() => linkedInRef.current?.open()}
        loading={loading === 'linkedin'}
        disabled={loading !== null}
      >
        <LinkedInModal
          ref={linkedInRef}
          renderButton={() => <LinkedIcon color={theme.colors.iconColor} />}
          shouldGetAccessToken={false}
          clientSecret={Config.LinkedClientSecret}
          clientID={Config.LinkedClientId}
          redirectUri={Config.LinkedRedirectUrl}
          onSuccess={token => {
            if (token) {
              dispatch(setOAuthLoading('linkedin'));
              getUser(token);
            }
          }}
          onError={() => {
            dispatch(setOAuthLoading(null));
          }}
        />
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

export default LinkedInAuthButton;

export const useStyles = makeStyles(theme => ({
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
  },
}));
