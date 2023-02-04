import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootReduxState } from 'src/types/redux.types';
import { FetchResponseError } from 'src/types/fetch.types';
import { fetchAction } from 'src/redux/fetch';
import { API } from 'src/constants/apiEndpoints';
import { TokenPayload } from 'src/types/authentication.types';
import { deleteSecureValue, setSecureValue } from 'src/utils/secureStorage';
import { secureStoreKeys } from 'src/constants/secureStoreKeys';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getProvider } from 'src/utils/common';

export const userRegistration = createAsyncThunk<
  true,
  { firstName: string; lastName: string; email: string; password: string },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  'authentication/userRegistration',
  async (
    { firstName, lastName, email, password },
    { dispatch, rejectWithValue },
  ) => {
    const { errors } = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.REGISTRATION,
          method: 'POST',
          data: {
            firstName,
            lastName,
            email,
            password,
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    // await setSecureValue(secureStoreKeys.JWT_TOKEN, data.token);

    return true;
  },
);
export const userLogin = createAsyncThunk<
  true,
  { email: string; password: string; fcmToken: string },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  'authentication/userLogin',
  async ({ email, password, fcmToken }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.LOGIN,
          method: 'POST',
          data: {
            email,
            password,
          },
          headers: {
            fcmtoken: fcmToken,
          },
        },
        false,
      ),
    );
    if (errors) {
      return rejectWithValue(errors);
    }

    if (data.token) {
      await setSecureValue(secureStoreKeys.JWT_TOKEN, data.token);
    }

    return true;
  },
);
export const userForgotPassword = createAsyncThunk<
  true,
  { email: string },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  'authentication/userForgotPassword',
  async ({ email }, { dispatch, rejectWithValue }) => {
    const { errors } = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.FORGOT_PASSWORD,
          method: 'POST',
          data: {
            email,
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    // await setSecureValue(secureStoreKeys.JWT_TOKEN, data.token);

    return true;
  },
);

export const userChangePassword = createAsyncThunk<
  true,
  { oldPassword: string; newPassword: string },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  'authentication/userChangePassword',
  async ({ oldPassword, newPassword }, { dispatch, rejectWithValue }) => {
    const { errors } = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.CHANGE_PASSWORD,
          method: 'POST',
          data: {
            oldPassword,
            newPassword,
          },
        },
        true,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    // await setSecureValue(secureStoreKeys.JWT_TOKEN, data.token);

    return true;
  },
);

export const oAuth = createAsyncThunk<
  TokenPayload,
  { credential: FirebaseAuthTypes.AuthCredential },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  'authentication/oAuth',
  async ({ credential }, { dispatch, rejectWithValue }) => {
    try {
      await auth().signInWithCredential(credential);
    } catch (e) {
      return rejectWithValue(e);
    }
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.OAUTH,
          method: 'POST',
          data: {
            idToken: await auth().currentUser.getIdToken(),
            email: auth().currentUser.email,
            name: auth().currentUser.displayName
              ? auth().currentUser.displayName
              : '',
            uid: auth().currentUser.uid,
            provider: getProvider(
              auth().currentUser.providerData[0].providerId,
            ),
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    await setSecureValue(secureStoreKeys.JWT_TOKEN, data.token);

    return data;
  },
);

export const linkedinAuth = createAsyncThunk<
  TokenPayload,
  {
    idToken: string;
    email: string;
    name: string;
    uid: string;
    provider: number;
  },
  { state: RootReduxState; rejectValue: FetchResponseError }
>(
  'authentication/oAuth',
  async (
    { idToken, email, name, uid, provider },
    { dispatch, rejectWithValue },
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<TokenPayload>(
        {
          url: API.OAUTH,
          method: 'POST',
          data: {
            idToken: idToken,
            email: email,
            name: name,
            uid: uid,
            provider: provider,
          },
        },
        false,
      ),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    await setSecureValue(secureStoreKeys.JWT_TOKEN, data.token);

    return data;
  },
);

export const logout = createAsyncThunk<
  void,
  void,
  { state: RootReduxState; rejectValue: FetchResponseError }
>('authentication/logout', async (_, { dispatch, rejectWithValue }) => {
  const { errors } = await dispatch(
    fetchAction({
      url: API.LOGOUT,
      method: 'DELETE',
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  await deleteSecureValue(secureStoreKeys.JWT_TOKEN);
  return null;
});
