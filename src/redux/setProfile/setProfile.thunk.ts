import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const updateMissingEmail = createAsyncThunk<
  string,
  { email: string; fcmToken: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateMissingEmail',
  async ({ email, fcmToken }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: {
          email,
        },
        headers: {
          fcmtoken: fcmToken,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateRegisterType = createAsyncThunk<
  string,
  { steps: number; userType: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateRegisterType',
  async ({ steps, userType }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: {
          steps: steps,
          userType: userType,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateLocationStateCity = createAsyncThunk<
  string,
  { steps: number; state: string; city: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateLocationStateCity',
  async ({ steps, state, city }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: {
          steps,
          state,
          city,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateUserPracticeArea = createAsyncThunk<
  string,
  { steps: number; userPracticeArea: number[] },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateUserPracticeArea',
  async ({ steps, userPracticeArea }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: {
          steps,
          userPracticeArea,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateUserProfilePhoto = createAsyncThunk<
  string,
  FormData,
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateUserProfilePhoto',
  async (formData, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: formData,
        headers: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateUserAssociationNumber = createAsyncThunk<
  string,
  { steps: number; associationNumber: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateUserAssociationNumber',
  async ({ steps, associationNumber }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: {
          steps,
          associationNumber,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateStudentEmail = createAsyncThunk<
  string,
  { steps: number; studentEmail: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/updateStudentEmail',
  async ({ steps, studentEmail }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SET_PROFILE,
        method: 'PATCH',
        data: {
          steps,
          studentEmail,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const studentSendEmailVerification = createAsyncThunk<
  string,
  { studentEmail: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/studentSendEmailVerification',
  async ({ studentEmail }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SEND_OTP_FOR_STUDENT_EMAIL,
        method: 'POST',
        data: {
          studentEmail,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const studentVerifyOTPForEmail = createAsyncThunk<
  string,
  { otp: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'setProfile/studentVerifyOTPForEmail',
  async ({ otp }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.VERIFY_OTP_FOR_STUDENT_EMAIL,
        method: 'POST',
        data: {
          otp,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
