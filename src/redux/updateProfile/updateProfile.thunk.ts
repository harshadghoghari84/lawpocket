import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const updateProfilePhoto = createAsyncThunk<
  string,
  FormData,
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateProfilePhoto',
  async (formData, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
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

export const updateClientProfile = createAsyncThunk<
  string,
  { firstName: string; lastName: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateClientProfile',
  async ({ firstName, lastName }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
          firstName,
          lastName,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updateStudentProfile = createAsyncThunk<
  string,
  { firstName: string; lastName: string; studentEmail: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateStudentProfile',
  async (
    { firstName, lastName, studentEmail },
    { dispatch, rejectWithValue },
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
          firstName,
          lastName,
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
export const updateAttorneyProfile = createAsyncThunk<
  string,
  { firstName: string; lastName: string; associationNumber: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateAttorneyProfile',
  async (
    { firstName, lastName, associationNumber },
    { dispatch, rejectWithValue },
  ) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
          firstName,
          lastName,
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
export const updateLFAndLSPProfile = createAsyncThunk<
  string,
  { firstName: string; lastName: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateLFAndLSPProfile',
  async ({ firstName, lastName }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
          firstName,
          lastName,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const updatePracticeAreaProfile = createAsyncThunk<
  string,
  { userPracticeArea: number[] },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updatePracticeAreaProfile',
  async ({ userPracticeArea }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
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
export const updateLocationProfile = createAsyncThunk<
  string,
  { state: string; city: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateLocationProfile',
  async ({ state, city }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
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
export const updateEmailProfile = createAsyncThunk<
  string,
  { email: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateEmailProfile',
  async ({ email }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_EMAIL,
        method: 'PATCH',
        data: {
          email,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const resendVerifyEmail = createAsyncThunk<
  string,
  { email: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/resendVerifyEmail',
  async ({ email }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>(
        {
          url: API.RESEND_VERIFY_EMAIL,
          method: 'PATCH',
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

    return data.message;
  },
);
export const updateNotificationStatus = createAsyncThunk<
  string,
  { isAllowNotification: boolean },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'updateProfile/updateNotificationStatus',
  async ({ isAllowNotification }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.UPDATE_PROFILE,
        method: 'PATCH',
        data: {
          isAllowNotification,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
